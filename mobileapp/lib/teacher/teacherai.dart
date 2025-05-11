import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';
import 'dart:async'; // Add this import for TimeoutException
import 'package:http/http.dart' as http; // Add this import for API calls

import '../components/teacherheader.dart';
import '../components/teacherFooter.dart';
import '../components/facaisidebar.dart';

class TeacherAi extends StatefulWidget {
  @override
  State<TeacherAi> createState() => _LandingPageState();
}

class _LandingPageState extends State<TeacherAi>
    with SingleTickerProviderStateMixin {
  int _selectedIndex = 3;
  TextEditingController _messageController = TextEditingController();
  String? _selectedSubject;
  List<String> _subjects = [
    "Math",
    "Science",
    "History",
    "English",
    "Geography",
    "Physics",
    "Chemistry"
  ];
  List<String> _difficulties = ["Easy", "Medium", "Hard"];
  List<String> _questionTypes = ["MCQ", "Short Answer", "Essay", "Full Paper"];
  Set<String> _selectedQuestionTypes = {"MCQ"};
  List<String> _gradeLevels = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12"
  ];

  Map<String, List<String>> _chapters = {
    "Math": [
      "Chapter 1: Numbers",
      "Chapter 2: Algebra",
      "Chapter 3: Geometry",
      "Chapter 4: Statistics"
    ],
    "Science": [
      "Chapter 1: Matter",
      "Chapter 2: Energy",
      "Chapter 3: Living Things",
      "Chapter 4: Earth & Space"
    ],
    "History": [
      "Chapter 1: Ancient History",
      "Chapter 2: Medieval Period",
      "Chapter 3: Modern Era",
      "Chapter 4: World Wars"
    ],
    "English": [
      "Chapter 1: Grammar",
      "Chapter 2: Literature",
      "Chapter 3: Writing Skills",
      "Chapter 4: Comprehension"
    ],
    "Geography": [
      "Chapter 1: Physical Geography",
      "Chapter 2: Climate",
      "Chapter 3: Resources",
      "Chapter 4: Population"
    ],
    "Physics": [
      "Chapter 1: Mechanics",
      "Chapter 2: Thermodynamics",
      "Chapter 3: Electricity",
      "Chapter 4: Optics"
    ],
    "Chemistry": [
      "Chapter 1: Elements",
      "Chapter 2: Compounds",
      "Chapter 3: Reactions",
      "Chapter 4: Organic Chemistry"
    ]
  };

  Map<String, Map<String, List<String>>> _topics = {
    "Math": {
      "Chapter 1: Numbers": [
        "Integers",
        "Fractions",
        "Decimals",
        "Real Numbers"
      ],
      "Chapter 2: Algebra": [
        "Equations",
        "Inequalities",
        "Functions",
        "Polynomials"
      ],
      "Chapter 3: Geometry": [
        "Lines & Angles",
        "Triangles",
        "Circles",
        "Coordinate Geometry"
      ],
      "Chapter 4: Statistics": [
        "Mean, Median & Mode",
        "Probability",
        "Data Representation",
        "Standard Deviation"
      ]
    },
    "Science": {
      "Chapter 1: Matter": [
        "States of Matter",
        "Elements & Compounds",
        "Mixtures",
        "Physical Changes"
      ],
      "Chapter 2: Energy": [
        "Forms of Energy",
        "Energy Transfer",
        "Conservation of Energy",
        "Renewable Energy"
      ],
      "Chapter 3: Living Things": ["Cells", "Plants", "Animals", "Ecosystems"],
      "Chapter 4: Earth & Space": [
        "Solar System",
        "Weather",
        "Natural Resources",
        "Climate Change"
      ]
    },
    // Add topics for other subjects similarly
  };

  bool _isSidebarVisible = false;
  TabController? _tabController;
  String? _selectedDifficulty;
  String? _selectedGradeLevel;
  int _numberOfQuestions = 10;
  int _timeLimit = 30;
  String? _selectedChapter;
  String? _selectedTopic;

  // Test generator controllers
  TextEditingController _numberOfQuestionsController =
      TextEditingController(text: "10");
  TextEditingController _timeLimitController =
      TextEditingController(text: "30");

  // Student data for grade card generator
  List<Map<String, dynamic>> _students = [
    {'id': '1', 'name': 'Aarav Sharma', 'grade': '10th', 'section': 'A'},
    {'id': '2', 'name': 'Ananya Patel', 'grade': '10th', 'section': 'A'},
    {'id': '3', 'name': 'Vikram Singh', 'grade': '10th', 'section': 'B'},
    {'id': '4', 'name': 'Riya Gupta', 'grade': '10th', 'section': 'B'},
    {'id': '5', 'name': 'Arjun Kumar', 'grade': '11th', 'section': 'A'},
    {'id': '6', 'name': 'Neha Verma', 'grade': '11th', 'section': 'A'},
  ];

  Map<String, dynamic>? _selectedStudent;

  // Replace the dummy previous chats with data that will be loaded from JSON
  List<Map<String, String>> _previousChats = [];
  // Store the full chat data for detailed view
  List<dynamic> _fullChatData = [];
  Map<String, dynamic>? _selectedChat;
  File? _selectedPaper;
  String? _paperPreviewPath;
  bool _isSolvingPaper = false;
  bool _paperSolved = false;
  String _paperSolutionText = '';

  bool _isGeneratingTest = false;
  Map<String, dynamic>? _generatedTest;
  String? _testGenerationError;

  // API endpoints - updated to support multiple environments and CORS
  // Using 10.0.2.2 instead of 127.0.0.1 for Android emulator to access host machine
  final String _baseUrl = 'http://192.168.101.165:5000';
  late String _apiUrl;
  late String _downloadApiUrl;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);

    // Initialize API endpoints
    _apiUrl = '$_baseUrl/api/generate-test';
    _downloadApiUrl = '$_baseUrl/api/download-test';

    // Add listener for tab changes to reset state when switching tabs
    _tabController!.addListener(() {
      if (!_tabController!.indexIsChanging) {
        setState(() {
          // Reset error messages when changing tabs
          _testGenerationError = null;

          // Optionally reset other tab-specific states if needed
          if (_tabController!.index == 0) {
            // Test Generator tab
          } else if (_tabController!.index == 1) {
            // Grade Cards tab
            _selectedStudent = null;
          } else if (_tabController!.index == 2) {
            // Paper Solver tab
            _paperSolved = false;
            _paperSolutionText = '';
          }
        });
      }
    });

    loadChatData();
    _checkApiConnection();
  }

  @override
  void dispose() {
    _tabController?.dispose();
    _messageController.dispose();
    _numberOfQuestionsController.dispose();
    _timeLimitController.dispose();
    super.dispose();
  }

  // Check if API is accessible
  Future<void> _checkApiConnection() async {
    try {
      // Use a GET request to the base URL which is more likely to succeed for checking
      final response = await http
          .get(
            Uri.parse(_baseUrl),
          )
          .timeout(Duration(seconds: 3));

      print("API connection check status: ${response.statusCode}");
    } catch (e) {
      // Handle different types of errors
      if (e is SocketException) {
        print("API connection error: Server not running or unreachable");
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                  'Cannot connect to the server at 10.0.2.2:5000.\n\nMake sure:\n- The Flask server is running\n- It was started with host=0.0.0.0\n- Your firewall allows connections'),
              backgroundColor: Colors.red,
              duration: Duration(seconds: 8),
              action: SnackBarAction(
                label: 'Retry',
                onPressed: _checkApiConnection,
              ),
            ),
          );
        }
      } else if (e is TimeoutException) {
        print("API connection error: Connection timed out");
      } else {
        print("API connection error: $e");
      }
    }
  }

  void _updateSubject(String? newValue) {
    setState(() {
      _selectedSubject = newValue;
      _selectedChapter = null;
      _selectedTopic = null;
    });
  }

  void _updateChapter(String? newValue) {
    setState(() {
      _selectedChapter = newValue;
      _selectedTopic = null;
    });
  }

  void _selectTab(int index) {
    _tabController!.animateTo(index);
  }

  Future<void> loadChatData() async {
    try {
      final String response =
          await rootBundle.loadString('lib/data/doubtChat.json');
      final List<dynamic> data = await json.decode(response);

      _fullChatData = data;

      List<Map<String, String>> chatList = [];

      for (var chat in data) {
        if (chat['responses'] != null && chat['responses'].isNotEmpty) {
          String dateStr = '';
          if (chat['responses'][0]['timeStamp'] != null) {
            final DateTime timestamp =
                DateTime.parse(chat['responses'][0]['timeStamp']);
            dateStr =
                '${timestamp.day} ${_getMonthAbbreviation(timestamp.month)}';
          }

          chatList.add({
            'date': dateStr,
            'chatId': chat['chatId'],
            'studentId': chat['studentId'],
            'prompt': chat['responses'][0]['prompt'],
          });
        }
      }

      setState(() {
        _previousChats = chatList;
      });
    } catch (e) {
      print('Error loading chat data: $e');
    }
  }

  String _getMonthAbbreviation(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return months[month - 1];
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    switch (index) {
      case 0:
        Navigator.pushNamed(context, '/taecherhome');
        break;
      case 1:
        Navigator.pushNamed(context, '/teacherassignment');
        break;
      case 2:
        Navigator.pushNamed(context, '/teachercommunity');
        break;
      case 3:
        Navigator.pushNamed(context, '/teacherai');
        break;
      case 4:
        Navigator.pushNamed(context, '/teacherresources');
      case 5:
        Navigator.pushNamed(context, '/teacherclassroom');
        break;
    }
  }

  void _toggleSidebar() {
    setState(() {
      _isSidebarVisible = !_isSidebarVisible;
    });
  }

  String _getQuestionTypeForAPI(String type) {
    if (type == 'MCQ') return 'multiple_choice';
    if (type == 'Short Answer') return 'short_answer';
    if (type == 'Essay') return 'essay';
    if (type == 'Full Paper') return 'full_paper';
    return 'multiple_choice';
  }

  int _extractGradeNumber(String? gradeText) {
    if (gradeText == null) return 9;
    final matches = RegExp(r'\d+').firstMatch(gradeText);
    return matches != null ? int.parse(matches.group(0)!) : 9;
  }

  Future<void> _generateTest() async {
    if (_selectedGradeLevel == null ||
        _selectedSubject == null ||
        _selectedChapter == null ||
        _selectedQuestionTypes.isEmpty ||
        _selectedDifficulty == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content:
              Text('Please fill in all required fields to generate a test'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isGeneratingTest = true;
      _testGenerationError = null;
      _generatedTest = null;
    });

    try {
      final requestData = {
        'subject': _selectedSubject,
        'grade_level': _extractGradeNumber(_selectedGradeLevel),
        'topic': _selectedTopic ?? _selectedChapter ?? "General",
        'question_types':
            _selectedQuestionTypes.map(_getQuestionTypeForAPI).toList(),
        'difficulty': _selectedDifficulty?.toLowerCase() ?? 'medium',
        'number_of_questions': _numberOfQuestions,
        'time_limit': _timeLimit
      };

      print("Sending request to generate test: $requestData");

      final response = await http
          .post(
            Uri.parse(_apiUrl),
            headers: {"Content-Type": "application/json"},
            body: jsonEncode(requestData),
          )
          .timeout(Duration(
              seconds: 60)); // Add timeout to prevent indefinite waiting

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        if (responseData['test_content'] != null) {
          try {
            final rawContent = responseData['test_content'];
            dynamic parsedContent;

            if (rawContent.toString().contains('```')) {
              final jsonContent = rawContent
                  .toString()
                  .replaceAll(RegExp(r'```json'), '')
                  .replaceAll(RegExp(r'```'), '')
                  .trim();
              parsedContent = jsonDecode(jsonContent);
            } else {
              parsedContent = jsonDecode(rawContent);
            }

            // Add validation for expected keys
            if (!parsedContent.containsKey('title') ||
                !parsedContent.containsKey('questions')) {
              throw Exception("Invalid test format: missing required fields");
            }

            final formattedTest = {
              "title": parsedContent['title'],
              "questions": parsedContent['questions'],
              "answerKey":
                  parsedContent['answer_key'] ?? "Answer key not available",
              "estimatedTime": parsedContent['estimated_time'] ?? _timeLimit,
              "instructions": parsedContent['instructions'] ??
                  'Answer all questions to the best of your ability.'
            };

            setState(() {
              _generatedTest = formattedTest;
              _isGeneratingTest = false;
            });

            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content:
                    Text('Test generated successfully! Ready to download.'),
                backgroundColor: Colors.green,
                action: SnackBarAction(
                  label: 'Download',
                  textColor: Colors.white,
                  onPressed: () {
                    _downloadTest();
                  },
                ),
              ),
            );
          } catch (parseError) {
            print("Error parsing test content: $parseError");
            setState(() {
              _testGenerationError =
                  "Failed to parse the generated test. Please try again.";
              _isGeneratingTest = false;
            });
          }
        } else {
          throw Exception("Invalid response format: test_content not found");
        }
      } else {
        final errorMessage = response.statusCode == 500
            ? "Server error: The API encountered a problem"
            : "API Error: Status code ${response.statusCode}";

        try {
          final errorData = jsonDecode(response.body);
          throw Exception(
              "${errorMessage}: ${errorData['error'] ?? 'Unknown error'}");
        } catch (_) {
          throw Exception(errorMessage);
        }
      }
    } catch (error) {
      print("Error generating test: $error");
      setState(() {
        _testGenerationError = error.toString();
        _isGeneratingTest = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to generate test: ${error.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _downloadTest() async {
    if (_generatedTest == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No test available to download'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      // Show loading indicator
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Preparing download...'),
          duration: Duration(seconds: 1),
        ),
      );

      // Prepare data for download
      final requestData = {
        'test_data': jsonEncode(_generatedTest),
        'subject': _selectedSubject ?? "General",
        'filename':
            "${_selectedSubject?.toLowerCase() ?? 'test'}_${DateTime.now().millisecondsSinceEpoch}.json"
      };

      // Call the download API
      final response = await http
          .post(
            Uri.parse(_downloadApiUrl),
            headers: {"Content-Type": "application/json"},
            body: jsonEncode(requestData),
          )
          .timeout(Duration(seconds: 30));

      if (response.statusCode == 200) {
        // Successfully received file data
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Test downloaded successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        throw Exception(
            "Download failed: Server returned status code ${response.statusCode}");
      }
    } catch (error) {
      print("Download error: $error");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Download feature unavailable: ${error.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Widget _buildTestPreview() {
    if (_generatedTest == null) return Container();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _generatedTest?['title'] ?? 'Generated Test',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 16),
        Card(
          elevation: 2,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          child: Padding(
            padding: EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Test Details',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Subject',
                              style: TextStyle(color: Colors.grey.shade700)),
                          Text(_selectedSubject ?? 'N/A',
                              style: TextStyle(fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Difficulty',
                              style: TextStyle(color: Colors.grey.shade700)),
                          Text(_selectedDifficulty ?? 'N/A',
                              style: TextStyle(fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Questions',
                              style: TextStyle(color: Colors.grey.shade700)),
                          Text('${_numberOfQuestions}',
                              style: TextStyle(fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Time Limit',
                              style: TextStyle(color: Colors.grey.shade700)),
                          Text('${_timeLimit} minutes',
                              style: TextStyle(fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Question Types',
                              style: TextStyle(color: Colors.grey.shade700)),
                          Text(
                            _selectedQuestionTypes.join(', '),
                            style: TextStyle(fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        SizedBox(height: 16),
        Text(
          'Questions Preview',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 8),
        Expanded(
          child: ListView.builder(
            itemCount: (_generatedTest?['questions'] as List?)?.length ?? 0,
            itemBuilder: (context, index) {
              final question = (_generatedTest?['questions'] as List)[index];
              final questionType = question['type'] ?? '';

              return Card(
                margin: EdgeInsets.only(bottom: 10),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
                child: Padding(
                  padding: EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Q${index + 1}: ${question['question']}',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      SizedBox(height: 8),
                      if (questionType == 'multipleChoice' ||
                          questionType == 'multiple_choice')
                        ...List.generate(
                          (question['options'] as List?)?.length ?? 0,
                          (i) => Padding(
                            padding: EdgeInsets.symmetric(vertical: 4),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${String.fromCharCode(65 + i)}. ',
                                  style: TextStyle(fontWeight: FontWeight.w500),
                                ),
                                Expanded(
                                  child: Text(question['options'][i]),
                                ),
                              ],
                            ),
                          ),
                        ),
                      SizedBox(height: 8),
                      if (question['answer'] != null)
                        Container(
                          padding: EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.green.shade50,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.check_circle,
                                  color: Colors.green, size: 16),
                              SizedBox(width: 4),
                              Text(
                                'Answer: ${question['answer']}',
                                style: TextStyle(
                                    color: Colors.green.shade800,
                                    fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: ElevatedButton(
                onPressed: _downloadTest,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE195AB),
                  padding: EdgeInsets.symmetric(vertical: 12),
                ),
                child: Text('Download Test'),
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  setState(() {
                    _generatedTest = null;
                  });
                },
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 12),
                ),
                child: Text('Create Another'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE195AB),
      body: Stack(
        children: [
          SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: TeacherHeader(
                      onProfileTap: () {
                        Navigator.pushNamed(context, '/teacherprofile');
                      },
                      onNotificationTap: () {
                        Navigator.pushNamed(context, '/teachernotifications');
                      },
                      profileImage: 'assets/images/teacher.png',
                      welcomeText: "WELCOME",
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    height: 705,
                    margin: const EdgeInsets.fromLTRB(0.0, 30.0, 0.0, 0.0),
                    padding: const EdgeInsets.fromLTRB(4.0, 12.0, 4.0, 12.0),
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 236, 231, 202),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: Column(
                      children: [
                        TabBar(
                          controller: _tabController,
                          labelColor: Colors.black,
                          unselectedLabelColor: Colors.grey,
                          indicatorColor: const Color(0xFFE195AB),
                          indicatorWeight: 3,
                          labelStyle: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 14),
                          unselectedLabelStyle: TextStyle(fontSize: 14),
                          labelPadding:
                              EdgeInsets.symmetric(horizontal: 8, vertical: 10),
                          tabs: [
                            Tab(
                              child: Container(
                                padding: EdgeInsets.symmetric(horizontal: 8),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.assessment, size: 12),
                                    SizedBox(width: 0),
                                    Text('Test Generator'),
                                  ],
                                ),
                              ),
                            ),
                            Tab(
                              child: Container(
                                padding: EdgeInsets.symmetric(horizontal: 8),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.grade, size: 12),
                                    SizedBox(width: 0),
                                    Text('Grade Cards'),
                                  ],
                                ),
                              ),
                            ),
                            Tab(
                              child: Container(
                                padding: EdgeInsets.symmetric(horizontal: 8),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.assignment_turned_in, size: 12),
                                    SizedBox(width: 0),
                                    Text('Paper Solver'),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 15),
                        Expanded(
                          child: TabBarView(
                            controller: _tabController,
                            physics: BouncingScrollPhysics(),
                            children: [
                              AnimatedSwitcher(
                                duration: Duration(milliseconds: 300),
                                child: _buildTestGeneratorTab(),
                              ),
                              AnimatedSwitcher(
                                duration: Duration(milliseconds: 300),
                                child: _buildGradeCardGeneratorTab(),
                              ),
                              AnimatedSwitcher(
                                duration: Duration(milliseconds: 300),
                                child: _buildPaperSolverTab(),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (_isSidebarVisible)
            Positioned(
              top: 0,
              left: 0,
              bottom: 0,
              child: FacChatSidebar(
                previousChats: _previousChats,
                onClose: _toggleSidebar,
                onChatSelected: (chatId) => _selectChat(chatId),
              ),
            ),
        ],
      ),
      bottomNavigationBar: TeacherFooter(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildTestGeneratorTab() {
    if (_generatedTest != null) {
      return _buildTestPreview();
    }

    return SingleChildScrollView(
      child: Container(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Generate AI-Powered Test',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            if (_testGenerationError != null)
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(10),
                margin: EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Text(
                  _testGenerationError!,
                  style: TextStyle(color: Colors.red.shade800),
                ),
              ),
            const Text(
              'Grade Level',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: _selectedGradeLevel,
                  hint: Text("Select Grade Level"),
                  icon: Icon(Icons.arrow_drop_down),
                  iconSize: 24,
                  elevation: 16,
                  style: TextStyle(color: Colors.black),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedGradeLevel = newValue;
                    });
                  },
                  items: _gradeLevels
                      .map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Subject',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: _selectedSubject,
                  hint: Text("Select Subject"),
                  icon: Icon(Icons.arrow_drop_down),
                  iconSize: 24,
                  elevation: 16,
                  style: TextStyle(color: Colors.black),
                  onChanged: _updateSubject,
                  items:
                      _subjects.map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Chapter',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: _selectedChapter,
                  hint: Text("Select Chapter"),
                  icon: Icon(Icons.arrow_drop_down),
                  iconSize: 24,
                  elevation: 16,
                  style: TextStyle(color: Colors.black),
                  onChanged: _selectedSubject != null ? _updateChapter : null,
                  items: _selectedSubject != null
                      ? (_chapters[_selectedSubject] ?? [])
                          .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList()
                      : [],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Topic',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: _selectedTopic,
                  hint: Text("Select Topic"),
                  icon: Icon(Icons.arrow_drop_down),
                  iconSize: 24,
                  elevation: 16,
                  style: TextStyle(color: Colors.black),
                  onChanged:
                      (_selectedSubject != null && _selectedChapter != null)
                          ? (String? newValue) {
                              setState(() {
                                _selectedTopic = newValue;
                              });
                            }
                          : null,
                  items: (_selectedSubject != null && _selectedChapter != null)
                      ? (_topics[_selectedSubject]?[_selectedChapter] ?? [])
                          .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList()
                      : [],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Question Types',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: _questionTypes.map((type) {
                final selected = _selectedQuestionTypes.contains(type);
                return ChoiceChip(
                  label: Text(type),
                  selected: selected,
                  onSelected: (bool value) {
                    setState(() {
                      if (value) {
                        _selectedQuestionTypes.add(type);
                      } else {
                        _selectedQuestionTypes.remove(type);
                      }
                    });
                  },
                  selectedColor: const Color(0xFFE195AB),
                  backgroundColor: Colors.white,
                  labelStyle: TextStyle(
                    color: selected ? Colors.white : Colors.black,
                    fontWeight: FontWeight.w500,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
            const Text(
              'Difficulty',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: _selectedDifficulty,
                  hint: Text("Select Difficulty"),
                  icon: Icon(Icons.arrow_drop_down),
                  iconSize: 24,
                  elevation: 16,
                  style: TextStyle(color: Colors.black),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedDifficulty = newValue;
                    });
                  },
                  items: _difficulties
                      .map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Number of Questions',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: TextField(
                          controller: _numberOfQuestionsController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                horizontal: 12, vertical: 14),
                            border: InputBorder.none,
                            hintText: "10",
                          ),
                          onChanged: (value) {
                            setState(() {
                              _numberOfQuestions = int.tryParse(value) ?? 10;
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Time Limit (minutes)',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: TextField(
                          controller: _timeLimitController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                horizontal: 12, vertical: 14),
                            border: InputBorder.none,
                            hintText: "30",
                          ),
                          onChanged: (value) {
                            setState(() {
                              _timeLimit = int.tryParse(value) ?? 30;
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _isGeneratingTest ? null : _generateTest,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE195AB),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: _isGeneratingTest
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          ),
                          SizedBox(width: 10),
                          Text(
                            'Generating Test...',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      )
                    : const Text(
                        'Generate Test',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGradeCardGeneratorTab() {
    return Container(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Generate Student Grade Card',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Select Student',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
              ),
              child: ListView.builder(
                itemCount: _students.length,
                itemBuilder: (context, index) {
                  final student = _students[index];
                  final isSelected = _selectedStudent != null &&
                      _selectedStudent!['id'] == student['id'];

                  return Card(
                    elevation: isSelected ? 4 : 1,
                    margin: EdgeInsets.symmetric(vertical: 4, horizontal: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                      side: BorderSide(
                        color: isSelected
                            ? const Color(0xFFE195AB)
                            : Colors.transparent,
                        width: 2,
                      ),
                    ),
                    child: ListTile(
                      title: Text(
                        student['name'],
                        style: TextStyle(
                          fontWeight:
                              isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                      subtitle: Text(
                          '${student['grade']} - Section ${student['section']}'),
                      trailing: isSelected
                          ? Icon(Icons.check_circle,
                              color: const Color(0xFFE195AB))
                          : null,
                      onTap: () {
                        setState(() {
                          _selectedStudent = student;
                        });
                      },
                    ),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _generateGradeCard,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE195AB),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'Generate Grade Card',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaperSolverTab() {
    return SingleChildScrollView(
      child: Container(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'AI Paper Solver',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Upload a test paper and get AI-generated solutions',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 20),
            Container(
              width: double.infinity,
              height: 200,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: _selectedPaper != null
                      ? const Color(0xFFE195AB)
                      : Colors.grey.shade300,
                  width: _selectedPaper != null ? 2 : 1,
                ),
              ),
              child: _paperPreviewPath != null
                  ? Stack(
                      children: [
                        Center(
                          child:
                              _paperPreviewPath!.toLowerCase().endsWith('.pdf')
                                  ? Icon(
                                      Icons.picture_as_pdf,
                                      size: 80,
                                      color: const Color(0xFFE195AB),
                                    )
                                  : Image.file(
                                      File(_paperPreviewPath!),
                                      fit: BoxFit.contain,
                                      height: 180,
                                    ),
                        ),
                        Positioned(
                          top: 8,
                          right: 8,
                          child: InkWell(
                            onTap: () {
                              setState(() {
                                _selectedPaper = null;
                                _paperPreviewPath = null;
                                _paperSolved = false;
                                _paperSolutionText = '';
                              });
                            },
                            child: Container(
                              padding: EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.7),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                Icons.close,
                                color: Colors.red,
                                size: 20,
                              ),
                            ),
                          ),
                        ),
                      ],
                    )
                  : InkWell(
                      onTap: _pickPaper,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.upload_file,
                            size: 50,
                            color: Colors.grey,
                          ),
                          SizedBox(height: 12),
                          Text(
                            'Click to upload PDF or image',
                            style: TextStyle(color: Colors.grey),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Supported formats: PDF, JPG, PNG',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
            ),
            const SizedBox(height: 16),
            if (_selectedPaper != null)
              Container(
                padding: EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(5),
                ),
                child: Row(
                  children: [
                    Icon(
                      _paperPreviewPath!.toLowerCase().endsWith('.pdf')
                          ? Icons.picture_as_pdf
                          : Icons.image,
                      color: const Color(0xFFE195AB),
                      size: 20,
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _selectedPaper!.path.split('/').last,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 20),
            if (_selectedPaper != null)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Solving Options',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.grey.shade300),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.format_list_numbered,
                                color: const Color(0xFFE195AB),
                                size: 20,
                              ),
                              SizedBox(width: 8),
                              Text('Step-by-step solutions'),
                              Spacer(),
                              Switch(
                                value: true,
                                onChanged: (value) {},
                                activeColor: const Color(0xFFE195AB),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.grey.shade300),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.grading,
                                color: const Color(0xFFE195AB),
                                size: 20,
                              ),
                              SizedBox(width: 8),
                              Text('Include grading scheme'),
                              Spacer(),
                              Switch(
                                value: true,
                                onChanged: (value) {},
                                activeColor: const Color(0xFFE195AB),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _selectedPaper != null ? _solvePaper : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _selectedPaper != null
                      ? const Color(0xFFE195AB)
                      : Colors.grey.shade300,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: _isSolvingPaper
                    ? Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          ),
                          SizedBox(width: 10),
                          Text(
                            'Solving paper...',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      )
                    : Text(
                        'Generate Solution',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: _selectedPaper != null
                              ? Colors.white
                              : Colors.grey,
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 30),
            if (_paperSolved && _paperSolutionText.isNotEmpty)
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.auto_awesome,
                          color: const Color(0xFFE195AB),
                        ),
                        SizedBox(width: 8),
                        Text(
                          'AI-Generated Solution',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Spacer(),
                        IconButton(
                          icon: Icon(Icons.copy),
                          onPressed: () {
                            Clipboard.setData(
                              ClipboardData(text: _paperSolutionText),
                            );
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Solution copied to clipboard!'),
                              ),
                            );
                          },
                          tooltip: 'Copy solution',
                        ),
                        IconButton(
                          icon: Icon(Icons.download),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Solution downloaded as PDF!'),
                              ),
                            );
                          },
                          tooltip: 'Download as PDF',
                        ),
                      ],
                    ),
                    Divider(),
                    SizedBox(height: 8),
                    Text(
                      _paperSolutionText,
                      style: TextStyle(fontSize: 14, height: 1.5),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickPaper() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    );

    if (result != null) {
      setState(() {
        _selectedPaper = File(result.files.single.path!);
        _paperPreviewPath = result.files.single.path!;
        _paperSolved = false;
        _paperSolutionText = '';
      });
    }
  }

  void _solvePaper() {
    if (_selectedPaper == null) return;

    setState(() {
      _isSolvingPaper = true;
    });

    Future.delayed(Duration(seconds: 5), () {
      setState(() {
        _isSolvingPaper = false;
        _paperSolved = true;
        _paperSolutionText = _generateSampleSolution();
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Paper solved successfully!'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 2),
        ),
      );
    });
  }

  String _generateSampleSolution() {
    return """# Paper Solution

## Question 1: Solve for x in the equation 3x + 7 = 22
**Step 1:** Subtract 7 from both sides
3x + 7 - 7 = 22 - 7
3x = 15

**Step 2:** Divide both sides by 3
3x/3 = 15/3
x = 5

**Answer:** x = 5

## Question 2: Find the derivative of f(x) = 2x³ - 4x² + 5x - 3
**Step 1:** Apply the power rule for each term
f'(x) = 2(3x²) - 4(2x) + 5(1) - 0
f'(x) = 6x² - 8x + 5

**Answer:** f'(x) = 6x² - 8x + 5

## Question 3: Describe the main causes of World War II
The main causes of World War II included:

1. **Treaty of Versailles** - The harsh conditions imposed on Germany after World War I created resentment and economic hardship.

2. **Rise of fascism** - The emergence of dictatorial regimes in Germany (Hitler), Italy (Mussolini), and Japan that promoted aggressive expansionist policies.

3. **Failure of appeasement** - Western democracies' attempts to avoid conflict by making concessions to Hitler ultimately failed.

4. **Economic depression** - The global economic crisis of the 1930s created political instability and increased support for extremist ideologies.

5. **Japanese imperialism** - Japan's ambitions to create a vast empire in East Asia and the Pacific led to conflicts with China and eventually the United States.

**Grading scheme:**
- Full marks (5 points) for identifying at least 4 major causes with explanation
- Partial marks (3 points) for identifying 2-3 causes
- Minimal marks (1 point) for identifying only 1 cause

## Question 4: Explain the process of photosynthesis
Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy. The process occurs primarily in the chloroplasts of plant cells, especially in the leaves.

**Chemical equation:**
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

**Main stages:**
1. **Light-dependent reactions:**
   - Occur in thylakoid membranes
   - Chlorophyll absorbs light energy
   - Water molecules split, releasing oxygen
   - ATP and NADPH produced

2. **Calvin cycle (light-independent reactions):**
   - Takes place in the stroma
   - Carbon dioxide is incorporated into organic molecules
   - Uses ATP and NADPH from light-dependent reactions
   - Produces glucose as end product

**Answer should include:** Definition, chemical equation, stages, location in the cell, and importance to life on Earth.
""";
  }

  void _selectChat(String chatId) {
    final selectedChat = _fullChatData.firstWhere(
      (chat) => chat['chatId'] == chatId,
      orElse: () => null,
    );

    setState(() {
      _selectedChat = selectedChat;
      _isSidebarVisible = false;
    });
  }

  void _generateGradeCard() {
    if (_selectedStudent == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please select a student first'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Show a loading indicator
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Center(
        child: CircularProgressIndicator(
          color: const Color(0xFFE195AB),
        ),
      ),
    );

    // Simulate API call delay
    Future.delayed(Duration(seconds: 2), () {
      // Close loading dialog
      Navigator.of(context).pop();

      // Show success dialog with grade card
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Row(
            children: [
              Icon(Icons.school, color: const Color(0xFFE195AB)),
              SizedBox(width: 10),
              Text('Grade Card Generated'),
            ],
          ),
          content: Container(
            width: double.maxFinite,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Student: ${_selectedStudent!['name']}',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  Text(
                      'Class: ${_selectedStudent!['grade']} - Section ${_selectedStudent!['section']}'),
                  SizedBox(height: 15),
                  Table(
                    border: TableBorder.all(color: Colors.grey.shade300),
                    columnWidths: {
                      0: FlexColumnWidth(3),
                      1: FlexColumnWidth(1),
                      2: FlexColumnWidth(1),
                    },
                    children: [
                      TableRow(
                        decoration: BoxDecoration(color: Colors.grey.shade100),
                        children: [
                          Padding(
                            padding: EdgeInsets.all(8.0),
                            child: Text('Subject',
                                style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                          Padding(
                            padding: EdgeInsets.all(8.0),
                            child: Text('Marks',
                                style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                          Padding(
                            padding: EdgeInsets.all(8.0),
                            child: Text('Grade',
                                style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                      ...[
                        'Mathematics',
                        'Science',
                        'English',
                        'History',
                        'Geography'
                      ].map((subject) {
                        // Generate random marks between 65 and 98
                        final marks =
                            65 + (DateTime.now().millisecondsSinceEpoch % 33);
                        final grade = marks >= 90
                            ? 'A'
                            : marks >= 80
                                ? 'B'
                                : marks >= 70
                                    ? 'C'
                                    : 'D';

                        return TableRow(
                          children: [
                            Padding(
                              padding: EdgeInsets.all(8.0),
                              child: Text(subject),
                            ),
                            Padding(
                              padding: EdgeInsets.all(8.0),
                              child: Text('$marks'),
                            ),
                            Padding(
                              padding: EdgeInsets.all(8.0),
                              child: Text(grade,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: grade == 'A'
                                        ? Colors.green
                                        : grade == 'B'
                                            ? Colors.blue
                                            : grade == 'C'
                                                ? Colors.orange
                                                : Colors.red,
                                  )),
                            ),
                          ],
                        );
                      }).toList(),
                    ],
                  ),
                  SizedBox(height: 15),
                  Text('Overall Performance',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  SizedBox(height: 5),
                  Text(
                      'The student shows consistent performance across all subjects with particular strengths in Mathematics and Science. Recommend additional practice in English composition to improve writing skills.'),
                  SizedBox(height: 15),
                  Text('Attendance: 92%'),
                  Text('Class Rank: 4 out of 30'),
                  SizedBox(height: 10),
                  Text(
                      'Generated on: ${DateTime.now().toString().split(' ')[0]}'),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Close'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE195AB),
              ),
              onPressed: () {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Grade card downloaded as PDF'),
                  ),
                );
              },
              child: Text('Download PDF'),
            ),
          ],
        ),
      );
    });
  }
}
