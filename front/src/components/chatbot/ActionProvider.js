class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleMessage = async (message) => {
    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();

      if (data.answer) {
        const botMessage = this.createChatBotMessage(data.answer);
        this.updateChatbotState(botMessage);
      }

      this.setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = this.createChatBotMessage(
        "오류가 발생했습니다. 다시 시도해주세요."
      );
      this.updateChatbotState(errorMessage);

      this.setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  updateChatbotState(message) {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
