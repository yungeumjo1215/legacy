import axios from "axios";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [
        ...prevState.messages,
        {
          type: "bot",
          content: message.message,
          timestamp: new Date(),
        },
      ],
    }));
  };

  setLoading = (isLoading) => {
    this.setState((prevState) => ({
      ...prevState,
      isLoading,
    }));
  };

  handleHello = () => {
    const message =
      this.createChatBotMessage("안녕하세요! 무엇을 도와드릴까요?");
    this.addMessageToState(message);
  };

  handleGyeongbokgung = () => {
    const message = this.createChatBotMessage(
      "경복궁은 조선 왕조의 법궁으로, 1395년(태조 4년)에 창건되었습니다. 현재 서울특별시 종로구 사직로 161에 위치해 있습니다."
    );
    this.addMessageToState(message);
  };

  handleBulguksa = () => {
    const message = this.createChatBotMessage(
      "불국사는 경상북도 경주시에 있는 대한민국의 대표적인 사찰로, 751년(경덕왕 10년)에 창건되었습니다. 1995년 유네스코 세계문화유산으로 등재되었습니다."
    );
    this.addMessageToState(message);
  };

  handleSeokguram = () => {
    const message = this.createChatBotMessage(
      "석굴암은 경주 토함산에 있는 신라 시대의 석굴로, 751년(경덕왕 10년)에 착공하여 774년(혜공왕 10년)에 완공되었습니다. 1995년 불국사와 함께 유네스코 세계문화유산으로 등재되었습니다."
    );
    this.addMessageToState(message);
  };

  handleGeneralQuery = async (message) => {
    this.setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/chat", {
        message: message,
      });

      const botMessage = this.createChatBotMessage(response.data.message);
      this.addMessageToState(botMessage);
    } catch (error) {
      console.error("챗봇 응답 오류:", error);
      const errorMessage = this.createChatBotMessage(
        "죄송합니다. 응답을 처리하는 중에 오류가 발생했습니다."
      );
      this.addMessageToState(errorMessage);
    } finally {
      this.setLoading(false);
    }
  };
}

export default ActionProvider;
