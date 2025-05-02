import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';
import '../components/header.dart';
import '../components/footer.dart';
import '../components/chatSidebar.dart';
import 'dart:math';

class AiLanding extends StatefulWidget {
  @override
  State<AiLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<AiLanding>
    with SingleTickerProviderStateMixin {
  int _selectedIndex = 3; // AI Bot tab
  TextEditingController _messageController = TextEditingController();
  String? _selectedSubject;
  List<String> _subjects = [
    "Math",
    "Science",
    "History",
    "English",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology"
  ];
  bool _isSidebarVisible = false;
  bool _isLoading = false;
  bool _isTyping = false;
  late AnimationController _typingController;

  // Replace the dummy previous chats with data that will be loaded from JSON
  List<Map<String, String>> _previousChats = [];
  // Store the full chat data for detailed view
  List<dynamic> _fullChatData = [];
  Map<String, dynamic>? _selectedChat;

  // Theme colors for student
  final Color studentPrimaryColor = const Color.fromARGB(255, 73, 171, 176);
  final Color backgroundColor = const Color.fromARGB(255, 236, 231, 202);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = Colors.amber;

  // Chat capabilities
  final List<Map<String, dynamic>> _capabilities = [
    {
      'title': 'Concepts',
      'icon': Icons.lightbulb_outline,
      'description': 'Explain complex concepts in a simple way',
      'prompt': 'Please explain the concept of ',
      'color': Color(0xFFFFA726),
    },
    {
      'title': 'Numericals',
      'icon': Icons.calculate_outlined,
      'description': 'Solve numerical problems step by step',
      'prompt': 'Can you solve this numerical problem: ',
      'color': Color(0xFF42A5F5),
    },
    {
      'title': 'Summarize',
      'icon': Icons.text_snippet_outlined,
      'description': 'Create concise summaries of text',
      'prompt': 'Please summarize the following text: ',
      'color': Color(0xFF66BB6A),
    },
    {
      'title': 'Practice',
      'icon': Icons.fitness_center_outlined,
      'description': 'Generate practice questions on any topic',
      'prompt': 'Generate practice questions about ',
      'color': Color(0xFFEC407A),
    },
  ];

  // Suggested questions
  final List<Map<String, dynamic>> _suggestedQuestions = [
    {
      'question': "Explain Newton's laws of motion",
      'subject': 'Physics',
    },
    {
      'question': "How do I solve quadratic equations?",
      'subject': 'Math',
    },
    {
      'question': "Summarize the process of photosynthesis",
      'subject': 'Biology',
    },
    {
      'question': "What are the key events of World War II?",
      'subject': 'History',
    },
    {
      'question': "Explain the concept of object-oriented programming",
      'subject': 'Computer Science',
    },
  ];

  @override
  void initState() {
    super.initState();
    loadChatData();
    _typingController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1500),
    )..repeat();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _typingController.dispose();
    super.dispose();
  }

  // Method to load chat data from JSON
  Future<void> loadChatData() async {
    setState(() {
      _isLoading = true;
    });

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

          // Get the first few words of the prompt for preview
          String promptPreview = chat['responses'][0]['prompt'] ?? '';
          if (promptPreview.length > 30) {
            promptPreview = promptPreview.substring(0, 30) + '...';
          }

          chatList.add({
            'date': dateStr,
            'chatId': chat['chatId'],
            'studentId': chat['studentId'],
            'prompt': promptPreview,
          });
        }
      }

      setState(() {
        _previousChats = chatList;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading chat data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Find the full chat data by chatId
  void _selectChat(String chatId) {
    // Fix the firstWhere method by providing a valid fallback
    final selectedChat = _fullChatData.firstWhere(
      (chat) => chat['chatId'] == chatId,
      orElse: () => <String, dynamic>{}, // Return an empty map instead of null
    );

    setState(() {
      _selectedChat = selectedChat;
      _isSidebarVisible = false; // Close sidebar after selection
    });
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
        Navigator.pushReplacementNamed(context, '/');
        break;
      case 1:
        Navigator.pushReplacementNamed(context, '/assignment');
        break;
      case 2:
        Navigator.pushReplacementNamed(context, '/community');
        break;
      case 3:
        Navigator.pushReplacementNamed(context, '/aibot');
        break;
      case 4:
        Navigator.pushReplacementNamed(context, '/resources');
        break;
    }
  }

  void _toggleSidebar() {
    setState(() {
      _isSidebarVisible = !_isSidebarVisible;
    });
  }

  void _sendMessage() {
    final message = _messageController.text.trim();
    if (message.isNotEmpty) {
      // Show typing indicator
      setState(() {
        _isTyping = true;
      });

      // In a real app, you would send this to your API
      print('Sending message: $message');

      // Simulate network delay for demo
      Future.delayed(Duration(seconds: 1), () {
        // Mock response for demo purposes
        setState(() {
          if (_selectedChat == null) {
            // Create a new chat with proper structure
            final chatId = 'chat_${DateTime.now().millisecondsSinceEpoch}';
            final newChat = <String, dynamic>{
              'chatId': chatId,
              'studentId': 'student001',
              'responses': [
                {
                  'prompt': message,
                  'output': _generateAIResponse(message),
                  'timeStamp': DateTime.now().toIso8601String(),
                }
              ]
            };

            // Add to full chat data
            _fullChatData.add(newChat);

            // Set as current chat
            _selectedChat = newChat;

            // Add to previous chats with proper structure
            _previousChats.add({
              'date':
                  '${DateTime.now().day} ${_getMonthAbbreviation(DateTime.now().month)}',
              'chatId': chatId,
              'studentId': 'student001',
              'prompt': message.length > 30
                  ? message.substring(0, 30) + '...'
                  : message,
            });
          } else {
            // Add to existing chat if it exists
            if (_selectedChat!.containsKey('responses')) {
              _selectedChat!['responses'].add({
                'prompt': message,
                'output': _generateAIResponse(message),
                'timeStamp': DateTime.now().toIso8601String(),
              });
            } else {
              // Initialize responses array if it doesn't exist
              _selectedChat!['responses'] = [
                {
                  'prompt': message,
                  'output': _generateAIResponse(message),
                  'timeStamp': DateTime.now().toIso8601String(),
                }
              ];
            }
          }
          _isTyping = false;
        });
      });

      _messageController.clear();
    }
  }

  // Generate a more realistic AI response based on the query
  String _generateAIResponse(String query) {
    query = query.toLowerCase();

    // Basic response templates
    if (query.contains('newton') || query.contains('law of motion')) {
      return "Newton's three laws of motion are fundamental principles in classical mechanics:\n\n1. First Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an external force.\n\n2. Second Law: The force acting on an object is equal to the mass of that object times its acceleration (F = ma).\n\n3. Third Law: For every action, there is an equal and opposite reaction.";
    } else if (query.contains('quadratic')) {
      return "To solve quadratic equations of the form ax² + bx + c = 0:\n\n1. Try factoring: If possible, factor the equation and set each factor equal to zero.\n\n2. Use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\n\n3. Complete the square: This restructures the equation to find the solution.\n\nExample: For x² + 5x + 6 = 0\nFactoring: (x + 2)(x + 3) = 0\nSolutions: x = -2 or x = -3";
    } else if (query.contains('photosynthesis')) {
      return "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy. The basic equation is:\n\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\nThe process occurs in two main stages:\n1. Light-dependent reactions: Occur in thylakoid membranes, convert light energy to ATP and NADPH\n2. Calvin cycle (light-independent): Uses ATP and NADPH to convert CO₂ into glucose";
    } else if (query.contains('world war ii') ||
        query.contains('world war 2')) {
      return "Key events of World War II (1939-1945):\n\n• 1939: Nazi Germany invades Poland; Britain and France declare war on Germany\n• 1941: Japan attacks Pearl Harbor; US enters the war\n• 1942-43: Battle of Stalingrad turns tide against Germany on Eastern Front\n• 1944: D-Day landings in Normandy\n• 1945: Germany surrenders (May); Atomic bombs dropped on Hiroshima and Nagasaki; Japan surrenders (September)";
    } else if (query.contains('object') && query.contains('programming')) {
      return "Object-Oriented Programming (OOP) is a programming paradigm based on 'objects' containing data and code. Key concepts include:\n\n• Classes: Templates that define object properties and behaviors\n• Objects: Instances of classes\n• Encapsulation: Hiding internal state and requiring interaction through methods\n• Inheritance: Creating new classes that inherit properties from parent classes\n• Polymorphism: Ability to present the same interface for different underlying forms\n\nOOP helps organize code for large software systems, making them more modular and maintainable.";
    }

    // Generic response for other queries
    return "I understand you're asking about \"$query\". This is an important topic in its field.\n\nTo answer your question thoroughly, I would need to provide context, definitions, and examples.\n\nWould you like me to elaborate on any specific aspect of this topic or provide a more detailed explanation?";
  }

  void _useCapability(Map<String, dynamic> capability) {
    _messageController.text = capability['prompt'];
    // Focus the text field
    FocusScope.of(context).requestFocus(FocusNode());
  }

  void _askSuggestedQuestion(String question) {
    _messageController.text = question;
    _sendMessage();
  }

  void _createNewChat() {
    setState(() {
      _selectedChat = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: studentPrimaryColor,
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: Colors.white))
          : SafeArea(
              child: Stack(
                children: [
                  Column(
                    children: [
                      // Header section
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                        child: Header(
                          onProfileTap: () {
                            Navigator.pushNamed(context, '/profile');
                          },
                          onNotificationTap: () {
                            Navigator.pushNamed(context, '/notifications');
                          },
                          profileImage: 'assets/images/image3.png',
                          welcomeText: "WELCOME",
                        ),
                      ),

                      // Main content
                      Expanded(
                        child: Container(
                          decoration: BoxDecoration(
                            color: backgroundColor,
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(30),
                              topRight: Radius.circular(30),
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 10,
                                spreadRadius: 1,
                                offset: Offset(0, -2),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              // Header with menu button and chat title
                              Container(
                                padding: EdgeInsets.fromLTRB(12, 16, 16, 12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.only(
                                    topLeft: Radius.circular(30),
                                    topRight: Radius.circular(30),
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.05),
                                      blurRadius: 5,
                                      spreadRadius: 1,
                                      offset: Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: Row(
                                  children: [
                                    Material(
                                      color: Colors.transparent,
                                      borderRadius: BorderRadius.circular(30),
                                      child: InkWell(
                                        borderRadius: BorderRadius.circular(30),
                                        onTap: _toggleSidebar,
                                        child: Container(
                                          padding: EdgeInsets.all(8),
                                          child: Icon(
                                            Icons.menu_rounded,
                                            color: studentPrimaryColor,
                                          ),
                                        ),
                                      ),
                                    ),
                                    SizedBox(width: 12),
                                    _selectedChat != null
                                        ? Row(
                                            children: [
                                              CircleAvatar(
                                                backgroundColor:
                                                    studentPrimaryColor
                                                        .withOpacity(0.2),
                                                radius: 16,
                                                child: Icon(
                                                  Icons.smart_toy_rounded,
                                                  size: 18,
                                                  color: studentPrimaryColor,
                                                ),
                                              ),
                                              SizedBox(width: 8),
                                              Text(
                                                "AI Assistant",
                                                style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.w600,
                                                  color: textColor,
                                                ),
                                              ),
                                            ],
                                          )
                                        : Row(
                                            children: [
                                              Container(
                                                padding: EdgeInsets.symmetric(
                                                    horizontal: 12,
                                                    vertical: 6),
                                                decoration: BoxDecoration(
                                                  color: studentPrimaryColor
                                                      .withOpacity(0.1),
                                                  borderRadius:
                                                      BorderRadius.circular(20),
                                                ),
                                                child: Row(
                                                  children: [
                                                    Icon(
                                                      Icons.smart_toy_rounded,
                                                      size: 16,
                                                      color:
                                                          studentPrimaryColor,
                                                    ),
                                                    SizedBox(width: 6),
                                                    Text(
                                                      "AI Study Assistant",
                                                      style: TextStyle(
                                                        fontSize: 14,
                                                        fontWeight:
                                                            FontWeight.w600,
                                                        color:
                                                            studentPrimaryColor,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                    Spacer(),
                                    if (_selectedChat != null)
                                      Material(
                                        color: Colors.transparent,
                                        borderRadius: BorderRadius.circular(30),
                                        child: InkWell(
                                          borderRadius:
                                              BorderRadius.circular(30),
                                          onTap: _createNewChat,
                                          child: Container(
                                            padding: EdgeInsets.all(8),
                                            child: Icon(
                                              Icons.add_circle_outline_rounded,
                                              color: studentPrimaryColor,
                                            ),
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ),

                              // Main content area
                              Expanded(
                                child: _selectedChat != null
                                    ? _buildChatInterface()
                                    : _buildEnhancedInitialScreen(),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Sidebar overlay with sleek animation
                  if (_isSidebarVisible) _buildEnhancedSidebar(),
                ],
              ),
            ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
      floatingActionButton: !_isSidebarVisible
          ? FloatingActionButton(
              onPressed: _createNewChat,
              backgroundColor: studentPrimaryColor,
              child: Icon(Icons.add),
              tooltip: "New Conversation",
              elevation: 4,
            )
          : null,
    );
  }

  Widget _buildEnhancedSidebar() {
    return AnimatedOpacity(
      opacity: _isSidebarVisible ? 1.0 : 0.0,
      duration: Duration(milliseconds: 200),
      child: GestureDetector(
        onTap: _toggleSidebar, // Close sidebar when tapping outside
        child: Container(
          color: Colors.black54, // Semi-transparent background
          child: Row(
            children: [
              // Animated sliding sidebar
              AnimatedContainer(
                duration: Duration(milliseconds: 300),
                curve: Curves.easeInOut,
                width: _isSidebarVisible
                    ? MediaQuery.of(context).size.width * 0.75
                    : 0,
                child: ClipRRect(
                  borderRadius: BorderRadius.only(
                    topRight: Radius.circular(16),
                    bottomRight: Radius.circular(16),
                  ),
                  child: Container(
                    color: Colors.white,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Header
                        Container(
                          padding: EdgeInsets.symmetric(
                              horizontal: 20, vertical: 24),
                          decoration: BoxDecoration(
                            color: studentPrimaryColor,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 8,
                                offset: Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Row(
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "AI Assistant",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    "Your conversation history",
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.8),
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                              Spacer(),
                              Material(
                                color: Colors.transparent,
                                borderRadius: BorderRadius.circular(30),
                                child: InkWell(
                                  borderRadius: BorderRadius.circular(30),
                                  onTap: _toggleSidebar,
                                  child: Container(
                                    padding: EdgeInsets.all(8),
                                    child: Icon(Icons.close_rounded,
                                        color: Colors.white),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // New Chat button
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                          child: ElevatedButton.icon(
                            onPressed: () {
                              _createNewChat();
                              _toggleSidebar();
                            },
                            icon: Icon(Icons.add_rounded),
                            label: Text("New Chat"),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: studentPrimaryColor,
                              foregroundColor: Colors.white,
                              elevation: 2,
                              padding: EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              minimumSize: Size(double.infinity, 48),
                            ),
                          ),
                        ),

                        // Search chat history
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: "Search conversations",
                              prefixIcon: Icon(Icons.search_rounded,
                                  color: Colors.grey),
                              contentPadding: EdgeInsets.symmetric(vertical: 0),
                              filled: true,
                              fillColor: Colors.grey.shade100,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide.none,
                              ),
                              hintStyle: TextStyle(color: Colors.grey.shade500),
                            ),
                          ),
                        ),

                        // Recent chats label
                        Padding(
                          padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
                          child: Text(
                            "Recent Conversations",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey.shade700,
                            ),
                          ),
                        ),

                        // Chat list
                        Expanded(
                          child: _previousChats.isEmpty
                              ? Center(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.chat_bubble_outline_rounded,
                                        size: 48,
                                        color: Colors.grey.shade400,
                                      ),
                                      SizedBox(height: 16),
                                      Text(
                                        "No conversations yet",
                                        style: TextStyle(
                                          color: Colors.grey.shade600,
                                          fontSize: 16,
                                        ),
                                      ),
                                      SizedBox(height: 8),
                                      Text(
                                        "Start a new chat to begin",
                                        style: TextStyle(
                                          color: Colors.grey.shade500,
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                  ),
                                )
                              : ListView.builder(
                                  physics: BouncingScrollPhysics(),
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 8),
                                  itemCount: _previousChats.length,
                                  itemBuilder: (context, index) {
                                    return _buildChatHistoryItem(
                                        _previousChats[index], index);
                                  },
                                ),
                        ),

                        // Settings button
                        Divider(height: 1),
                        Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 8),
                          child: ListTile(
                            leading: Icon(
                              Icons.settings_outlined,
                              color: Colors.grey.shade700,
                            ),
                            title: Text(
                              "Settings",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            onTap: () {
                              // Navigate to settings
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                    content: Text("Settings page coming soon")),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              // Transparent area to allow closing by tapping
              Expanded(
                child: Container(color: Colors.transparent),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChatHistoryItem(Map<String, String> chat, int index) {
    final isSelected =
        _selectedChat != null && _selectedChat!['chatId'] == chat['chatId'];
    final isRecent = index < 3;

    return Card(
      margin: EdgeInsets.symmetric(vertical: 4, horizontal: 4),
      color: isSelected ? studentPrimaryColor.withOpacity(0.1) : Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: isSelected ? studentPrimaryColor : Colors.transparent,
          width: 1,
        ),
      ),
      child: InkWell(
        onTap: () => _selectChat(chat['chatId']!),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: EdgeInsets.all(12),
          child: Row(
            children: [
              Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isSelected
                      ? studentPrimaryColor.withOpacity(0.2)
                      : Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  Icons.chat_rounded,
                  size: 16,
                  color:
                      isSelected ? studentPrimaryColor : Colors.grey.shade600,
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      chat['prompt'] ?? 'No prompt',
                      style: TextStyle(
                        fontWeight:
                            isSelected ? FontWeight.w600 : FontWeight.w500,
                        fontSize: 14,
                        color: isSelected ? studentPrimaryColor : textColor,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          chat['date'] ?? '',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        if (isRecent) ...[
                          SizedBox(width: 6),
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: studentPrimaryColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              "Recent",
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                                color: studentPrimaryColor,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEnhancedInitialScreen() {
    return Container(
      color: backgroundColor,
      child: SingleChildScrollView(
        physics: BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome card with animated gradient
              Container(
                width: double.infinity,
                margin: EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      studentPrimaryColor,
                      Color(0xFF52BCB3),
                      Color(0xFF3AA7B9),
                    ],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: studentPrimaryColor.withOpacity(0.3),
                      blurRadius: 12,
                      offset: Offset(0, 6),
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Icon(
                              Icons.smart_toy_rounded,
                              size: 32,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "AI Study Assistant",
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                "Your personal learning companion",
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.white.withOpacity(0.9),
                                ),
                              ),
                            ],
                          )
                        ],
                      ),
                      SizedBox(height: 20),
                      Text(
                        "I can help you understand concepts, solve problems, and answer your academic questions in a simple way.",
                        style: TextStyle(
                          fontSize: 15,
                          height: 1.5,
                          color: Colors.white.withOpacity(0.95),
                        ),
                      ),
                      SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          ElevatedButton.icon(
                            onPressed: () {
                              FocusScope.of(context).requestFocus(FocusNode());
                              _messageController.text =
                                  "Hi, I need help with my studies";
                              _sendMessage();
                            },
                            icon: Icon(Icons.waving_hand_rounded, size: 16),
                            label: Text("Say Hello"),
                            style: ElevatedButton.styleFrom(
                              foregroundColor: studentPrimaryColor,
                              backgroundColor: Colors.white,
                              elevation: 0,
                              padding: EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 10),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // AI capabilities section with improved cards
              Row(
                children: [
                  Icon(Icons.auto_awesome,
                      color: studentPrimaryColor, size: 18),
                  SizedBox(width: 8),
                  Text(
                    "What can I help you with?",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.85,
                children: _capabilities.map((capability) {
                  return _buildEnhancedCapabilityCard(capability);
                }).toList(),
              ),

              SizedBox(height: 24),

              // Ask a question section
              _buildEnhancedMessageInput(),

              SizedBox(height: 24),

              // Suggested questions with subject tags
              Row(
                children: [
                  Icon(Icons.lightbulb_outline_rounded,
                      color: studentPrimaryColor, size: 18),
                  SizedBox(width: 8),
                  Text(
                    "Try asking:",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 12),
              Column(
                children: _suggestedQuestions.asMap().entries.map((entry) {
                  return _buildEnhancedSuggestedQuestionItem(
                    entry.value['question']!,
                    entry.value['subject']!,
                    entry.key,
                  );
                }).toList(),
              ),

              SizedBox(height: 24),

              // Subject selection with better dropdown
              Row(
                children: [
                  Icon(Icons.category_outlined,
                      color: studentPrimaryColor, size: 18),
                  SizedBox(width: 8),
                  Text(
                    "Focus on a subject",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 12),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedSubject,
                    hint: Text(
                      "Select a subject to focus our conversation",
                      style: TextStyle(
                        fontSize: 15,
                        color: Colors.grey[600],
                      ),
                    ),
                    icon: Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: studentPrimaryColor.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: studentPrimaryColor,
                      ),
                    ),
                    iconSize: 24,
                    elevation: 16,
                    isExpanded: true,
                    style: TextStyle(
                      color: textColor,
                      fontSize: 16,
                    ),
                    onChanged: (String? newValue) {
                      setState(() {
                        _selectedSubject = newValue;
                      });
                    },
                    items:
                        _subjects.map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Row(
                          children: [
                            Icon(
                              _getSubjectIcon(value),
                              color: studentPrimaryColor,
                              size: 18,
                            ),
                            SizedBox(width: 12),
                            Text(value),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getSubjectIcon(String subject) {
    switch (subject.toLowerCase()) {
      case 'math':
        return Icons.calculate_outlined;
      case 'science':
        return Icons.science_outlined;
      case 'history':
        return Icons.history_edu_outlined;
      case 'english':
        return Icons.menu_book_outlined;
      case 'computer science':
        return Icons.computer_outlined;
      case 'physics':
        return Icons.biotech_outlined;
      case 'chemistry':
        return Icons.science_outlined;
      case 'biology':
        return Icons.eco_outlined;
      default:
        return Icons.school_outlined;
    }
  }

  Widget _buildEnhancedCapabilityCard(Map<String, dynamic> capability) {
    return Card(
      elevation: 2,
      shadowColor: Colors.black.withOpacity(0.1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: () => _useCapability(capability),
        borderRadius: BorderRadius.circular(16),
        splashColor: capability['color'].withOpacity(0.1),
        highlightColor: capability['color'].withOpacity(0.05),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: capability['color'].withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  capability['icon'],
                  size: 32,
                  color: capability['color'],
                ),
              ),
              SizedBox(height: 12),
              Text(
                capability['title'],
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              SizedBox(height: 8),
              Text(
                capability['description'],
                style: TextStyle(
                  fontSize: 13,
                  color: Colors.grey[600],
                  height: 1.3,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              SizedBox(height: 12),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: capability['color'].withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  "Try it",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: capability['color'],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEnhancedSuggestedQuestionItem(
      String question, String subject, int index) {
    final List<Color> colors = [
      Color(0xFF42A5F5), // Blue
      Color(0xFF66BB6A), // Green
      Color(0xFFFFA726), // Orange
      Color(0xFFEC407A), // Pink
      Color(0xFF8D6E63), // Brown
    ];

    return Card(
      margin: EdgeInsets.only(bottom: 10),
      elevation: 1,
      shadowColor: Colors.black.withOpacity(0.05),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () => _askSuggestedQuestion(question),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
          child: Row(
            children: [
              Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: colors[index % colors.length].withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  _getSubjectIcon(subject),
                  color: colors[index % colors.length],
                  size: 18,
                ),
              ),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      question,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: textColor,
                      ),
                    ),
                    SizedBox(height: 4),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: colors[index % colors.length].withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        subject,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                          color: colors[index % colors.length],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios_rounded,
                  color: Colors.grey.shade400, size: 14),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChatInterface() {
    return Column(
      children: [
        // Chat messages area
        Expanded(
          child: Container(
            padding: EdgeInsets.only(top: 8),
            decoration: BoxDecoration(
              color: backgroundColor,
            ),
            child: _buildEnhancedChatMessages(_selectedChat!),
          ),
        ),

        // Message input area at the bottom
        _buildEnhancedMessageInput(),
      ],
    );
  }

  Widget _buildEnhancedChatMessages(Map<String, dynamic> chatData) {
    if (chatData['responses'] == null || chatData['responses'].isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.chat_bubble_outline_rounded,
              size: 48,
              color: Colors.grey[400],
            ),
            SizedBox(height: 16),
            Text(
              "Start a conversation",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Text(
              "Ask a question to get started",
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: chatData['responses'].length + (_isTyping ? 1 : 0),
      reverse: false,
      physics: BouncingScrollPhysics(),
      itemBuilder: (context, index) {
        if (_isTyping && index == chatData['responses'].length) {
          return _buildTypingIndicator();
        }

        final response = chatData['responses'][index];
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User message bubble - from right
            Align(
              alignment: Alignment.centerRight,
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxWidth: MediaQuery.of(context).size.width * 0.8,
                ),
                child: Card(
                  color: studentPrimaryColor,
                  margin: EdgeInsets.only(bottom: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(16),
                      bottomLeft: Radius.circular(16),
                      bottomRight: Radius.circular(16),
                    ),
                  ),
                  elevation: 1,
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          response['prompt'],
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 15,
                          ),
                        ),
                        SizedBox(height: 6),
                        Text(
                          _formatTimestamp(response['timeStamp']),
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 10,
                          ),
                          textAlign: TextAlign.right,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // AI response bubble - from left
            Align(
              alignment: Alignment.centerLeft,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  CircleAvatar(
                    backgroundColor: Colors.white,
                    radius: 16,
                    child: Icon(
                      Icons.smart_toy_rounded,
                      size: 18,
                      color: studentPrimaryColor,
                    ),
                  ),
                  SizedBox(width: 8),
                  Flexible(
                    child: Card(
                      color: Colors.white,
                      margin: EdgeInsets.only(bottom: 16, right: 32),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          topRight: Radius.circular(16),
                          bottomLeft: Radius.circular(16),
                          bottomRight: Radius.circular(16),
                        ),
                      ),
                      elevation: 1,
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              response['output'],
                              style: TextStyle(
                                color: Colors.black87,
                                fontSize: 15,
                                height: 1.4,
                              ),
                            ),
                            if (response['fileUrl'] != null) ...[
                              SizedBox(height: 12),
                              InkWell(
                                onTap: () {
                                  // Handle attachment click
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                        content: Text('Opening attachment...')),
                                  );
                                },
                                borderRadius: BorderRadius.circular(12),
                                child: Container(
                                  padding: EdgeInsets.symmetric(
                                      vertical: 10, horizontal: 12),
                                  decoration: BoxDecoration(
                                    color: studentPrimaryColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color:
                                          studentPrimaryColor.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.attach_file_rounded,
                                        size: 18,
                                        color: studentPrimaryColor,
                                      ),
                                      SizedBox(width: 8),
                                      Text(
                                        'View Attachment',
                                        style: TextStyle(
                                          color: studentPrimaryColor,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                            SizedBox(height: 6),
                            _buildMessageActions(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildMessageActions() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Response copied to clipboard')),
            );
          },
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: Row(
              children: [
                Icon(Icons.copy_rounded, size: 14, color: Colors.grey.shade600),
                SizedBox(width: 4),
                Text(
                  "Copy",
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
        SizedBox(width: 8),
        InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                  content: Text('Please provide feedback on this response')),
            );
          },
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: Row(
              children: [
                Icon(Icons.thumb_up_alt_outlined,
                    size: 14, color: Colors.grey.shade600),
                SizedBox(width: 4),
                Text(
                  "Helpful",
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTypingIndicator() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          CircleAvatar(
            backgroundColor: Colors.white,
            radius: 16,
            child: Icon(
              Icons.smart_toy_rounded,
              size: 18,
              color: studentPrimaryColor,
            ),
          ),
          SizedBox(width: 8),
          Card(
            color: Colors.white,
            margin: EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                topRight: Radius.circular(16),
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            elevation: 1,
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 12, horizontal: 18),
              child: AnimatedBuilder(
                animation: _typingController,
                builder: (context, child) {
                  return Row(
                    children: List.generate(3, (index) {
                      final delay = index * 0.2;
                      final sinValue =
                          sin((_typingController.value * 2 * pi) + delay);
                      final offset = sinValue * 5;

                      return Container(
                        margin: EdgeInsets.symmetric(horizontal: 2),
                        child: Transform.translate(
                          offset: Offset(0, offset),
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: studentPrimaryColor.withOpacity(0.6),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      );
                    }),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTimestamp(String? timestamp) {
    if (timestamp == null) return '';
    try {
      final dateTime = DateTime.parse(timestamp);
      return DateFormat('h:mm a').format(dateTime);
    } catch (e) {
      return '';
    }
  }

  Widget _buildEnhancedMessageInput() {
    return Container(
      padding: EdgeInsets.fromLTRB(16, 10, 16, 16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, -3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Attachment button
          Material(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(30),
            child: InkWell(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Attachment upload coming soon...')),
                );
              },
              borderRadius: BorderRadius.circular(30),
              child: Container(
                padding: EdgeInsets.all(10),
                child: Icon(
                  Icons.attach_file_rounded,
                  color: Colors.grey[600],
                  size: 22,
                ),
              ),
            ),
          ),

          // Text field
          Expanded(
            child: Container(
              margin: EdgeInsets.symmetric(horizontal: 8),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: InputDecoration(
                        hintText: _selectedSubject != null
                            ? "Ask about ${_selectedSubject}..."
                            : "Ask me anything...",
                        border: InputBorder.none,
                        contentPadding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        hintStyle: TextStyle(color: Colors.grey[500]),
                      ),
                      minLines: 1,
                      maxLines: 5,
                      textCapitalization: TextCapitalization.sentences,
                      style: TextStyle(fontSize: 15, height: 1.4),
                    ),
                  ),
                  // Camera/image upload button inside text field
                  Material(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(30),
                    child: InkWell(
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                              content: Text('Camera upload coming soon...')),
                        );
                      },
                      borderRadius: BorderRadius.circular(30),
                      child: Container(
                        padding: EdgeInsets.all(8),
                        child: Icon(
                          Icons.camera_alt_rounded,
                          color: Colors.grey[600],
                          size: 22,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 4),
                ],
              ),
            ),
          ),

          // Send button
          Material(
            color: studentPrimaryColor,
            borderRadius: BorderRadius.circular(30),
            child: InkWell(
              onTap: _sendMessage,
              borderRadius: BorderRadius.circular(30),
              child: Container(
                padding: EdgeInsets.all(10),
                child: Icon(
                  Icons.send_rounded,
                  color: Colors.white,
                  size: 22,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
