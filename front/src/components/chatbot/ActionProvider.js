class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleMessage = async (message) => {
    // 고유 ID를 가진 로딩 메시지 생성
    const loadingId = Date.now();
    const loadingMessage = {
      ...this.createChatBotMessage("잠시만 기다려주세요...", {
        loading: true,
        withAvatar: true,
      }),
      id: loadingId,
    };

    try {
      // 로딩 메시지 추가
      this.setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, loadingMessage],
      }));

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();

      if (data.answer) {
        // 특정 로딩 메시지만 제거하고 새 메시지 추가
        this.setState((prevState) => ({
          ...prevState,
          messages: [
            ...prevState.messages.filter((msg) => msg.id !== loadingId),
            this.createChatBotMessage(data.answer),
          ],
        }));
      }
    } catch (error) {
      console.error("Error:", error);

      // 에러 시에도 특정 로딩 메시지만 제거
      this.setState((prevState) => ({
        ...prevState,
        messages: [
          ...prevState.messages.filter((msg) => msg.id !== loadingId),
          this.createChatBotMessage("오류가 발생했습니다. 다시 시도해주세요."),
        ],
      }));
    }
  };
}

export default ActionProvider;
