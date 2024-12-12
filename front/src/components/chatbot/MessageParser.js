class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    // 기본 키워드 응답
    if (lowerCaseMessage.includes("안녕")) {
      return this.actionProvider.handleHello();
    }

    // 문화재 관련 키워드 체크
    if (lowerCaseMessage.includes("경복궁")) {
      return this.actionProvider.handleGyeongbokgung();
    }

    if (lowerCaseMessage.includes("불국사")) {
      return this.actionProvider.handleBulguksa();
    }

    if (lowerCaseMessage.includes("석굴암")) {
      return this.actionProvider.handleSeokguram();
    }

    // 일반적인 질문은 API로 전달
    return this.actionProvider.handleGeneralQuery(message);
  }
}

export default MessageParser;
