class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    if (!message) return;

    // 일반 질문 처리
    this.actionProvider.handleMessage(message);
  }
}

export default MessageParser;
