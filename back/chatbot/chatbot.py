import os
import sys
import io
import bs4
from dotenv import load_dotenv
from langchain import hub
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate
from concurrent.futures import ThreadPoolExecutor


def initialize_rag_system():
    load_dotenv()
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OPENAI_API_KEY가 설정되지 않았습니다.")
    os.environ["LANGCHAIN_USER_AGENT"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

web_pages = ["http://localhost:3000/sample"]

loaders = [
    WebBaseLoader(
        web_paths=(url,),
        bs_kwargs=dict(
            parse_only=bs4.SoupStrainer(
                ["div", "p", "article"],
                attrs={"class": None}
            )
        )
    )
    for url in web_pages
]

# 병렬로 웹 페이지 로드
def load_document(loader):
    try:
        loaded_docs = loader.load()
        print(f"로드된 문서 내용: {[doc.page_content for doc in loaded_docs]}")
        print(f"HTML 내용: {loader.scrape()}")
        if loaded_docs and any(doc.page_content.strip() for doc in loaded_docs):
            return loaded_docs
        print("문서가 비어있습니다")
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
# print(f"문서의  {len(splits)}")
# len(splits)

if not splits:
    print("분활된 문서가 없습니다. 프로그램을 종료합니다.")
    sys.exit(1)

vectorstore = FAISS.from_documents(documents=splits, embedding=OpenAIEmbeddings())
retriever = vectorstore.as_retriever()

prompt = PromptTemplate.from_template(
        """당신은 한국의 문화재에 대해 전문적인 지식을 가진 도우미입니다. 
        주어진 문맥(context)을 바탕으로 질문(question)에 답변해주세요.
        답변은 한국어로 해주시고, 정확하고 친절하게 설명해주세요.

        질문: {question}
        문맥: {context}
        답변:"""
    )


llm = ChatOpenAI(model_name="gpt-4", temperature=0)


rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)


recieved_question = "숭례문에 대해 알려주세요."
# recieved_question = sys.argv[1]


answer = rag_chain.invoke(recieved_question)
print(answer)