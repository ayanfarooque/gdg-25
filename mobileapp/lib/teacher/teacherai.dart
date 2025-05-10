import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

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
  String? _selectedQuestionType = "MCQ";
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

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    loadChatData();
  }

  @override
  void dispose() {
    _tabController?.dispose();
    _messageController.dispose();
    _numberOfQuestionsController.dispose();
    _timeLimitController.dispose();
    super.dispose();
  }

  void _updateSubject(String? newValue) {
    setState(() {
      _selectedSubject = newValue;
      _selectedChapter = null;
      _selectedTopic = null;
    });
  }

  // Reset topic when chapter changes
  void _updateChapter(String? newValue) {
    setState(() {
      _selectedChapter = newValue;
      _selectedTopic = null;
    });
  }

  // Method to load chat data from JSON
  Future<void> loadChatData() async {
    try {
      final String response =
          await rootBundle.loadString('lib/data/doubtChat.json');
      final List<dynamic> data = await json.decode(response);

      // Store full chat data
      _fullChatData = data;

      // Convert JSON data to the format needed for previousChats
      List<Map<String, String>> chatList = [];

      for (var chat in data) {
        if (chat['responses'] != null && chat['responses'].isNotEmpty) {
          // Format the date from timestamp
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

  // Helper method to get month abbreviation
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

    // Navigate to different pages based on index
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

  void _generateTest() {
    // Validate inputs
    if (_selectedGradeLevel == null ||
        _selectedSubject == null ||
        _selectedChapter == null ||
        _selectedTopic == null ||
        _selectedQuestionType == null ||
        _selectedDifficulty == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill in all fields to generate a test'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Show processing message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            CircularProgressIndicator(color: Colors.white),
            SizedBox(width: 20),
            Text('Generating test...'),
          ],
        ),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 3),
      ),
    );

    // Simulate test generation delay
    Future.delayed(Duration(seconds: 3), () {
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Test generated successfully! Ready to download.'),
          backgroundColor: Colors.green,
          action: SnackBarAction(
            label: 'Download',
            textColor: Colors.white,
            onPressed: () {
              // Handle download action
            },
          ),
        ),
      );
    });
  }

  void _generateGradeCard() {
    if (_selectedStudent == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a student to generate grade card'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Show processing message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            CircularProgressIndicator(color: Colors.white),
            SizedBox(width: 20),
            Text('Generating grade card...'),
          ],
        ),
        backgroundColor: Colors.blue,
        duration: Duration(seconds: 2),
      ),
    );

    // Simulate grade card generation
    Future.delayed(Duration(seconds: 2), () {
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content:
              Text('Grade card generated for ${_selectedStudent!['name']}'),
          backgroundColor: Colors.green,
          action: SnackBarAction(
            label: 'View',
            textColor: Colors.white,
            onPressed: () {
              // Handle view action
            },
          ),
        ),
      );
    });
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
                        // Tab Bar
                        TabBar(
                          controller: _tabController,
                          labelColor: Colors.black,
                          unselectedLabelColor: Colors.grey,
                          indicatorColor: const Color(0xFFE195AB),
                          tabs: [
                            Tab(text: 'AI Test Generator'),
                            Tab(text: 'Grade Card Generator'),
                          ],
                        ),
                        const SizedBox(height: 15),

                        // Tab Bar View
                        Expanded(
                          child: TabBarView(
                            controller: _tabController,
                            children: [
                              // AI Test Generator Tab
                              _buildTestGeneratorTab(),

                              // AI Grade Card Generator Tab
                              _buildGradeCardGeneratorTab(),
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

  // Number of Questions and Time Limit inputs for the test generator
  Widget _buildTestGeneratorTab() {
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

            // 1. Grade Level - Now first
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

            // 2. Subject - Now second
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

            // 3. Chapter - New addition
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

            // 4. Topic - New addition
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

            // Question Type - Now as dropdown instead of chips
            const Text(
              'Question Type',
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
                  value: _selectedQuestionType,
                  hint: Text("Select Question Type"),
                  icon: Icon(Icons.arrow_drop_down),
                  iconSize: 24,
                  elevation: 16,
                  style: TextStyle(color: Colors.black),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedQuestionType = newValue;
                    });
                  },
                  items: _questionTypes
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

            // Difficulty
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

            // Number of Questions and Time Limit in a row
            Row(
              children: [
                // Number of Questions
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
                // Time Limit
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

            // Generate Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _generateTest,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE195AB),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text(
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

          // Student Selection
          const Text(
            'Select Student',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),

          // Student List
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

          // Generate Button
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

  // Find the full chat data by chatId
  void _selectChat(String chatId) {
    final selectedChat = _fullChatData.firstWhere(
      (chat) => chat['chatId'] == chatId,
      orElse: () => null,
    );

    setState(() {
      _selectedChat = selectedChat;
      _isSidebarVisible = false; // Close sidebar after selection
    });
  }
}
