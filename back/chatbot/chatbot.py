import os
import sys
import io
import time
from dotenv import load_dotenv
from langchain import hub
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate


# 시작 시간 기록
start_time = time.time()


load_dotenv()
os.getenv('OPENAI_API_KEY')
# print(f"환경 설정 완료: {time.time() - start_time:.2f}초")


sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')


# 현재 스크립트의 디렉토리를 기준으로 절대 경로 설정
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)  # 상위 디렉토리
data_path = os.path.join(parent_dir, 'back', '../data.txt') 


# print(parent_dir)
# print(data_path)


# 벡터 캐시 저장소 경로 수정
cache_dir = os.path.join(parent_dir, 'back', 'vector_cache')
cache_file = os.path.join(cache_dir, 'index.faiss')


loader = TextLoader(data_path, encoding='utf-8')


try:
    documents = loader.load()
    # print(f"문서 로딩 완료: {time.time() - start_time:.2f}초")
except Exception as e:
    # print(f"문서 로딩 중 오류 발생: {str(e)}")
    sys.exit(1)


# 문서가 비어있는지 확인
if not documents:
    print("문서를 가져오지 못했습니다. 프로그램을 종료합니다.")
    sys.exit(1)


# 문서 분할 시작
split_start = time.time()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
splits = text_splitter.split_documents(documents)
# print(f"문서 분할 완료: {time.time() - split_start:.2f}초, 분할된 문서 개수: {len(splits)}")


if not splits:
    print("분할된 문서가 없습니다. 프로그램을 종료합니다.")
    sys.exit(1)


# 벡터 저장소 생성 시작
vector_start = time.time()

if os.path.exists(cache_file):
    # print("캐시된 벡터 저장소를 불러옵니다.")
    load_start = time.time()
    vectorstore = FAISS.load_local(
        cache_dir,
        OpenAIEmbeddings(),
        allow_dangerous_deserialization=True  # 이 옵션을 추가
    )
    # print(f"캐시된 벡터 저장소 로드 완료: {time.time() - load_start:.2f}초")
else:
    print("새로운 벡터 저장소를 생성합니다.")
    create_start = time.time()
    vectorstore = FAISS.from_documents(
        documents=splits,
        embedding=OpenAIEmbeddings()
    )
    os.makedirs(cache_dir, exist_ok=True)
    vectorstore.save_local(cache_dir)
    # print(f"새로운 벡터 저장소 생성 완료: {time.time() - create_start:.2f}초")


# 벡터 저장소 크기 확인
# try:
#     vector_count = vectorstore.index.ntotal
#     print(f"벡터 저장소에 저장된 벡터 수: {vector_count}")
# except:
#     print(f"벡터 저장소 크기를 확인할 수 없습니다.")


retriever = vectorstore.as_retriever()
# print(f"벡터 저장소 생성 완료: {time.time() - vector_start:.2f}초")


# # 벡터 저장소 상태 확인
# print(f"벡터 저장소 타입: {type(vectorstore)}")
# print(f"인덱스 타입: {type(vectorstore.index)}")
# print(f"사용 가능한 속성들: {dir(vectorstore.index)}")


prompt = PromptTemplate.from_template(
    """당신은 질문-답변(Question-Answering)을 수행하는 친절한 AI 어시스턴트입니다. 당신의 임무는 주어진 문맥(context) 에서 주어진 질문(question) 에 답하는 것입니다.
검색된 다음 문맥(context) 을 사용하여 질문(question) 에 답하세요. 만약, 주어진 문맥(context) 에서 답을 찾을 수 없다면, 답을 모른다면 `주어진 정보에서 질문에 대한 정보를 찾을 수 없습니다` 라고 답하세요.
한글로 답변해 주세요. 단, 기술적인 용어나 이름은 번역하지 않고 그대로 사용해 주세요.


#Question:
{question}


#Context:
{context}


#Answer:"""
)


llm = ChatOpenAI(model_name="gpt-4o", temperature=0)


rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)


# 질문 처리 시작
query_start = time.time()


# recieved_question = sys.argv[1]
recieved_question = "숭례문에 대해 간략하게 설명해 주세요"
answer = rag_chain.invoke(recieved_question)
print(answer)
# print(f"질문 처리 완료: {time.time() - query_start:.2f}초")
# print(f"전체 실행 시간: {time.time() - start_time:.2f}초")


