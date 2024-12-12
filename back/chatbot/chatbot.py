import os # 환경 변수 및 경로 처리
import sys # 시스템 관련 처리
import io # 입출력 관련 처리
import bs4 # beautifulsoup4 라이브러리 - html 파싱(크롤링)
from dotenv import load_dotenv

from langchain import hub
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate
from concurrent.futures import ThreadPoolExecutor # 병렬 처리를 위한 모듈



load_dotenv()
os.getenv('OPENAI_API_KEY') 

# USER_AGENT 환경변수 설정
os.environ["LANGCHAIN_USER_AGENT"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

web_pages=["https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=00030000&ccbaCtcd=11",
           
           ]

loaders = [
    WebBaseLoader(
        web_paths=(url,),
        bs_kwargs=dict(
            parse_only=bs4.SoupStrainer(
                "div",
                attrs={"class": ["article_view"]} # 태그 이름,class 이름 별도로 맞춤
            )
        )
    )
    for url in web_pages
]

# 병렬로 웹 페이지 로드
def load_document(loader):
    try:
        loaded_docs = loader.load()
        if loaded_docs:  # 문서가 비어있지 않은 경우에만 추가
            return loaded_docs
    except Exception as e:
        print(f"문서 로딩 중 오류 발생: {str(e)}")
    return []


with ThreadPoolExecutor() as executor:
    results = executor.map(load_document, loaders)


documents = [doc for result in results for doc in result if result]


# 문서가 비어있는지 확인
if not documents:
    print("문서를 가져오지 못했습니다. 프로그램을 종료합니다.")
    sys.exit(1)


text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)


splits = text_splitter.split_documents(documents)
# print(f"문서의 수 {len(splits)}")
# len(splits)

if not splits:
    print("분활된 문서가 없습니다. 프로그램을 종료합니다.")
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


# recieved_question = "추위를 타게 만드는 식습관에 대해 2줄로 요약해 주세요."
recieved_question = sys.argv[1]


answer = rag_chain.invoke(recieved_question)
print(answer)