class ApiConstants {
  static const String baseUrl = "http://localhost:5000/api";
  static const String chatbotEndpoint = "$baseUrl/chatbot";
  static const String askDoubtEndpoint = "$chatbotEndpoint/ask-doubt";
  static const String chatHistoryEndpoint = "$chatbotEndpoint/student/";
  static const String chatResponsesEndpoint = "$chatbotEndpoint/";
}