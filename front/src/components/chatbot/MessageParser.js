class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    // 먼저 로딩 상태를 true로 설정
    this.actionProvider.setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    // 그 다음 메시지 처리 시작
    this.actionProvider.handleMessage(message);
  }
}

export default MessageParser;
