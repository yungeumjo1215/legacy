import os
import sys
import io
from dotenv import load_dotenv
from langchain import hub
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate

load_dotenv()
os.getenv('OPENAI_API_KEY')

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

# TextLoader를 사용하여 텍스트 파일 로드
loader = TextLoader('../data.txt', encoding='utf-8')

try:
    documents = loader.load()
    print("문서 로딩 성공")
except Exception as e:
    print(f"문서 로딩 중 오류 발생: {str(e)}")
    sys.exit(1)

# 문서가 비어있는지 확인
if not documents:
    print("문서를 가져오지 못했습니다. 프로그램을 종료합니다.")
    sys.exit(1)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
splits = text_splitter.split_documents(documents)

if not splits:
    print("분할된 문서가 없습니다. 프로그램을 종료합니다.")
    sys.exit(1)

vectorstore = FAISS.from_documents(documents=splits, embedding=OpenAIEmbeddings())
retriever = vectorstore.as_retriever()

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

recieved_question = "숭례문에 대해 두 줄로 설명해 주세요."
answer = rag_chain.invoke(recieved_question)
print(answer)