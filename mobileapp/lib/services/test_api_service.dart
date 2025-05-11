import 'dart:convert';
import 'package:http/http.dart' as http;

class TestApiService {
  final String baseUrl = 'http://127.0.0.1:5000/api';

  /// Generates a test using the AI API
  Future<Map<String, dynamic>> generateTest({
    required String subject,
    required int gradeLevel,
    required String topic,
    required List<String> questionTypes,
    required String difficulty,
    required int numberOfQuestions,
    required int timeLimit,
  }) async {
    final url = Uri.parse('$baseUrl/generate-test');

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        'subject': subject,
        'grade_level': gradeLevel,
        'topic': topic,
        'question_types': questionTypes,
        'difficulty': difficulty.toLowerCase(),
        'number_of_questions': numberOfQuestions,
        'time_limit': timeLimit,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['error'] ?? 'Failed to generate test');
    }
  }

  /// Downloads a test as a file
  Future<String> downloadTest({
    required Map<String, dynamic> testData,
    required String subject,
    String? filename,
  }) async {
    final url = Uri.parse('$baseUrl/download-test');

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        'test_data': jsonEncode(testData),
        'subject': subject,
        'filename': filename,
      }),
    );

    if (response.statusCode == 200) {
      // Handle file download (implementation depends on your needs)
      // For example, you could save it to local storage
      return 'Test downloaded successfully';
    } else {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['error'] ?? 'Failed to download test');
    }
  }
}
