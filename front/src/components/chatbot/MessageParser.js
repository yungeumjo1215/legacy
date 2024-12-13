class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    if (!message) return;

    console.log("사용자 메시지:", message); // 디버깅용

    // 일반 질문 처리
    this.actionProvider.handleMessage(message);
  }
}

export default MessageParser;
