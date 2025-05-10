import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import '../components/header.dart';
import '../components/footer.dart';
import '../components/chatSidebar.dart';
import 'dart:math';
import '../components/constants.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:file_picker/file_picker.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_math_fork/flutter_math.dart';

class AiLanding extends StatefulWidget {
  @override
  State<AiLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<AiLanding>
    with SingleTickerProviderStateMixin {
  // Your existing variables
  int _selectedIndex = 3;
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

  // API related variables
  final String _baseUrl =
      "http://localhost:5000/api"; // Update with your actual API URL
  String _studentId = "student001"; // This should come from auth/storage

  List<Map<String, String>> _previousChats = [];
  List<dynamic> _fullChatData = [];
  Map<String, dynamic>? _selectedChat;

  // Theme colors - keep as is
  final Color studentPrimaryColor = const Color.fromARGB(255, 73, 171, 176);
  final Color backgroundColor = const Color.fromARGB(255, 236, 231, 202);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = Colors.amber;

  // Chat capabilities - keep as is
  final List<Map<String, dynamic>> _capabilities = [
    {
      'icon': Icons.question_answer,
      'title': 'Answer questions',
      'color': Colors.blue
    },
    {
      'icon': Icons.calculate,
      'title': 'Solve math problems',
      'color': Colors.green
    },
    {
      'icon': Icons.functions,
      'title': 'Render equations',
      'color': Colors.amber
    },
    {'icon': Icons.fact_check, 'title': 'Check facts', 'color': Colors.purple},
  ];

  void _searchChats(String query) {
    // This would filter the previous chats based on the search query
    // For now, we're just printing it
    print('Search query: $query');
  }

  void _selectChat(String chatId) {
    if (chatId.isEmpty) return;
    _loadChat(chatId);
  }

  // Toggle sidebar
  void _toggleSidebar() {
    setState(() {
      _isSidebarVisible = !_isSidebarVisible;
    });
  }

  // Handle navigation
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

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
        // Already on AI page
        break;
      case 4:
        Navigator.pushReplacementNamed(context, '/resources');
        break;
      case 5:
        Navigator.pushReplacementNamed(context, '/classroom');
        break;
    }
  }

  // Image picker method
  Future<void> _pickAttachment() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.any,
      );

      if (result != null) {
        // Process the file - for now just show a success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('File selected: ${result.files.single.name}')),
        );
      }
    } catch (e) {
      print('Error picking attachment: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error selecting file. Please try again.')),
      );
    }
  }

  // Camera method
  Future<void> _takePicture() async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(source: ImageSource.camera);

      if (image != null) {
        // Process the image - for now just show a success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Image captured: ${image.name}')),
        );
      }
    } catch (e) {
      print('Error taking picture: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error capturing image. Please try again.')),
      );
    }
  }

  @override
  void initState() {
    super.initState();
    _loadChatHistory(); // Replace with API-based loading
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Header section
                Container(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  color: studentPrimaryColor,
                  child: Header(
                    onProfileTap: () {
                      Navigator.pushNamed(context, '/profile');
                    },
                    onNotificationTap: () {
                      Navigator.pushNamed(context, '/notifications');
                    },
                    profileImage: 'assets/images/image3.png',
                    welcomeText: "ASK ME ANYTHING",
                  ),
                ),

                // Main chat area
                Expanded(
                  child: Stack(
                    children: [
                      // Chat messages area
                      _selectedChat == null
                          ? _buildWelcomeScreen()
                          : _buildChatMessages(),

                      // Typing indicator
                      if (_isTyping) _buildTypingIndicator(),
                    ],
                  ),
                ),

                // Message input area
                _buildEnhancedMessageInput(),
              ],
            ),

            // Sidebar for chat history
            if (_isSidebarVisible) _buildSidebar(),
          ],
        ),
      ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  // Load chat history from API
  Future<void> _loadChatHistory() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Make API call to get chat history
      final response = await http.get(
        Uri.parse('$_baseUrl/chatbot/student/$_studentId'),
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
          // 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        if (data['success'] == true && data['chats'] != null) {
          // Store full chat data
          _fullChatData = data['chats'];

          // Convert API data to the format needed for previousChats
          List<Map<String, String>> chatList = [];

          for (var chat in data['chats']) {
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
        } else {
          setState(() {
            _previousChats = [];
            _isLoading = false;
          });
        }
      } else {
        throw Exception('Failed to load chat history');
      }
    } catch (e) {
      print('Error loading chat history: $e');
      setState(() {
        _isLoading = false;
      });

      // Fallback to local data for demo if API fails
      _loadLocalChatData();
    }
  }

  // Fallback method to load local chat data
  Future<void> _loadLocalChatData() async {
    try {
      final String response =
          await rootBundle.loadString('lib/data/doubtChat.json');
      final List<dynamic> data = await json.decode(response);

      _fullChatData = data;

      // Process local data as before
      List<Map<String, String>> chatList = [];

      for (var chat in data) {
        // Your existing processing logic
        if (chat['responses'] != null && chat['responses'].isNotEmpty) {
          String dateStr = '';
          if (chat['responses'][0]['timeStamp'] != null) {
            final DateTime timestamp =
                DateTime.parse(chat['responses'][0]['timeStamp']);
            dateStr =
                '${timestamp.day} ${_getMonthAbbreviation(timestamp.month)}';
          }

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
      });
    } catch (e) {
      print('Error loading local chat data: $e');
    }
  }

  // Load specific chat from API
  Future<void> _loadChat(String chatId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/chatbot/$chatId/responses'),
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          setState(() {
            // Find the chat in the existing data and update it with the full data
            _selectedChat = {
              'chatId': chatId,
              'studentId': _studentId,
              'responses': data['responses']
            };
            _isSidebarVisible = false;
          });
        }
      } else {
        // Fallback to local data
        _selectLocalChat(chatId);
      }
    } catch (e) {
      print('Error loading chat: $e');
      _selectLocalChat(chatId);
    }
  }

  // Fallback to select chat from local data
  void _selectLocalChat(String chatId) {
    final selectedChat = _fullChatData.firstWhere(
      (chat) => chat['chatId'] == chatId,
      orElse: () => <String, dynamic>{},
    );

    setState(() {
      _selectedChat = selectedChat;
      _isSidebarVisible = false;
    });
  }

  // Send message to API
  Future<void> _sendMessage() async {
    final message = _messageController.text.trim();
    if (message.isEmpty) return;

    // Check if the message contains an equation to solve
    final bool isEquation = _detectEquation(message);

    // Process as normal
    setState(() {
      _isTyping = true;
    });

    // Rest of your existing _sendMessage function...

    // If it's an equation and subject is math, add special handling
    if (isEquation &&
        (_selectedSubject == "Math" || _selectedSubject == "Physics")) {
      try {
        // Get the equation result separately while API call is happening
        _processEquationInBackground(message);
      } catch (e) {
        print('Error processing equation: $e');
      }
    }

    // Continue with the rest of your function...
  }

  bool _detectEquation(String message) {
    // Simple equation detection
    final equationPatterns = [
      RegExp(r'solve .* equation'),
      RegExp(r'calculate'),
      RegExp(r'find .* value'),
      RegExp(r'='),
      RegExp(r'[0-9]+[x+\-*/()^]+[0-9]+'),
      RegExp(r'integrate'),
      RegExp(r'differentiate'),
      RegExp(r'derivative'),
      RegExp(r'limit'),
    ];

    return equationPatterns
        .any((pattern) => pattern.hasMatch(message.toLowerCase()));
  }

  void _processEquationInBackground(String message) async {
    // Extract the equation from the message
    final equation = _extractEquation(message);
    if (equation == null) return;

    // Show "processing" card first
    setState(() {
      if (_selectedChat!.containsKey('equations')) {
        _selectedChat!['equations'].add({
          'raw': equation,
          'rendered': null,
          'processing': true,
        });
      } else {
        _selectedChat!['equations'] = [
          {
            'raw': equation,
            'rendered': null,
            'processing': true,
          }
        ];
      }
    });

    // Simulate processing (replace with actual API call if you have one)
    await Future.delayed(Duration(milliseconds: 800));

    // For simple equations like x+5=10, solve directly
    String? result = _solveSimpleEquation(equation);

    // For complex equations, prepare a LaTeX representation
    if (result == null) {
      result = _formatAsLatex(equation);
    }

    // Update UI with rendered equation
    setState(() {
      final index = (_selectedChat!['equations'] as List).length - 1;
      _selectedChat!['equations'][index]['rendered'] = result;
      _selectedChat!['equations'][index]['processing'] = false;
    });
  }

  String? _extractEquation(String message) {
    // Simple extraction - in reality you'd use more sophisticated parsing
    final equalsPattern = RegExp(r'([^=]+=[^=]+)');
    final solvePattern = RegExp(r'solve\s+(.+)');
    final calculatePattern = RegExp(r'calculate\s+(.+)');

    if (equalsPattern.hasMatch(message)) {
      return equalsPattern.firstMatch(message)?.group(1)?.trim();
    } else if (solvePattern.hasMatch(message)) {
      return solvePattern.firstMatch(message)?.group(1)?.trim();
    } else if (calculatePattern.hasMatch(message)) {
      return calculatePattern.firstMatch(message)?.group(1)?.trim();
    }

    // If no pattern matches, return the whole message as a potential equation
    return message;
  }

  String? _solveSimpleEquation(String equation) {
    // Very basic equation solver - just for demo
    // In a real app, you'd use a math library or API

    // Example: x+5=10
    final linearPattern = RegExp(r'([a-z])\s*\+\s*(\d+)\s*=\s*(\d+)');
    if (linearPattern.hasMatch(equation)) {
      final match = linearPattern.firstMatch(equation);
      if (match != null) {
        final variable = match.group(1);
        final addend = int.tryParse(match.group(2) ?? '');
        final result = int.tryParse(match.group(3) ?? '');

        if (addend != null && result != null) {
          final solution = result - addend;
          return '$variable = $solution';
        }
      }
    }

    return null; // Not a simple equation we can solve
  }

  String _formatAsLatex(String equation) {
    // Convert common math notation to LaTeX
    // This is a simplified example, you'd need more robust parsing
    String latex = equation
        .replaceAll('sqrt', '\\sqrt')
        .replaceAll('^', '^{')
        .replaceAll('pi', '\\pi')
        .replaceAll('theta', '\\theta')
        .replaceAll('sin', '\\sin')
        .replaceAll('cos', '\\cos')
        .replaceAll('tan', '\\tan');

    // Add closing braces for exponents
    int caretCount = latex.split('^{').length - 1;
    for (int i = 0; i < caretCount; i++) {
      latex += '}';
    }

    return latex;
  }

  // Helper method for math-specific responses
  String _generateMathResponse(String query) {
    query = query.toLowerCase();

    // Check for specific math topics
    if (query.contains('derivative') || query.contains('differentiate')) {
      return r"In calculus, the derivative of a function $f(x)$ represents the rate of change of the function with respect to its variable.\n\nThe derivative is denoted as:\n\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\n\nCommon derivative rules include:\n\n• Power rule: $\\frac{d}{dx}x^n = nx^{n-1}$\n\n• Product rule: $\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)$\n\n• Chain rule: $\\frac{d}{dx}f(g(x)) = f'(g(x))g'(x)$";
    }

    if (query.contains('limit') || query.contains('approaches')) {
      return r"In calculus, the limit of a function $f(x)$ as $x$ approaches a value $a$ is written as:\n\n$$\\lim_{x \\to a} f(x) = L$$\n\nThis means that as $x$ gets arbitrarily close to $a$, the function value gets arbitrarily close to $L$.\n\nImportant limit: $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$\n\nFor evaluating limits, we can use techniques like substitution, factoring, rationalization, or L'Hôpital's rule.";
    }

    if (query.contains('statistic') || query.contains('probability')) {
      return r"In statistics, the normal distribution is given by the probability density function:\n\n$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$\n\nWhere:\n• $\\mu$ is the mean\n• $\\sigma$ is the standard deviation\n\nThe variance is calculated as:\n\n$$\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\mu)^2$$\n\nThe standard deviation is the square root of the variance.";
    }

    if (query.contains('matrix') || query.contains('vector')) {
      return r"In linear algebra, a matrix is a rectangular array of numbers arranged in rows and columns.\n\nFor a 2×2 matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, the determinant is calculated as:\n\n$$\\det(A) = |A| = ad - bc$$\n\nMatrix multiplication is performed by multiplying rows of the first matrix by columns of the second:\n\n$$C_{ij} = \\sum_{k=1}^{n} A_{ik} B_{kj}$$\n\nThe inverse of a 2×2 matrix is given by:\n\n$$A^{-1} = \\frac{1}{\\det(A)} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$";
    }

    if (query.contains('triangle') || query.contains('trigonometry')) {
      return r"In trigonometry, the sine, cosine, and tangent of an angle $\\theta$ in a right triangle are defined as:\n\n$$\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}$$\n\n$$\\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$$\n\n$$\\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}} = \\frac{\\sin\\theta}{\\cos\\theta}$$\n\nThe Pythagorean identity states that:\n\n$$\\sin^2\\theta + \\cos^2\\theta = 1$$\n\nThe law of sines for any triangle states:\n\n$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$$";
    }

    if (query.contains('sequence') || query.contains('series')) {
      return r"A sequence is an ordered list of numbers, and a series is the sum of a sequence.\n\nFor an arithmetic sequence with first term $a$ and common difference $d$, the $n$th term is:\n\n$$a_n = a + (n-1)d$$\n\nFor a geometric sequence with first term $a$ and common ratio $r$, the $n$th term is:\n\n$$a_n = a \\cdot r^{n-1}$$\n\nThe sum of a finite geometric series is:\n\n$$S_n = a \\cdot \\frac{1-r^n}{1-r} \\text{ for } r \\neq 1$$\n\nThe sum of an infinite geometric series (when $|r| < 1$) is:\n\n$$S = \\frac{a}{1-r}$$";
    }

    // Default math response if no specific topic is matched
    return r"I notice you're asking about a math topic. To provide the most accurate answer, I can work through this step-by-step using mathematical notation.\n\nFor example, if we're dealing with equations, we can represent them like this:\n\n$$y = mx + b$$\n\nOr if we're working with more complex expressions:\n\n$$\\int_{a}^{b} f(x) dx = F(b) - F(a)$$\n\nCould you provide more details about your specific math question so I can give you a more targeted response with the appropriate formulas and explanations?";
  }

  // Fallback to generate local response
  void _addLocalResponse(String message) {
    setState(() {
      final lastResponseIndex = _selectedChat!['responses'].length - 1;
      _selectedChat!['responses'][lastResponseIndex]['output'] =
          _generateAIResponse(message);
    });
  }

  // Create a new chat
  Future<void> _createNewChat() async {
    setState(() {
      _selectedChat = null;
    });
  }

  // Helper methods from your existing code (keep these as is)
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

  // Your existing local AI response generator (for fallback) - keep as is
  String _generateAIResponse(String query) {
    query = query.toLowerCase();

    // Basic response templates with mathematical expressions
    if (query.contains('newton') || query.contains('law of motion')) {
      return r"Newton's three laws of motion are fundamental principles in classical mechanics:\n\n1. First Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an external force.\n\n2. Second Law: The force acting on an object is equal to the mass of that object times its acceleration: $F = ma$.\n\n3. Third Law: For every action, there is an equal and opposite reaction.";
    }

    if (query.contains('quadratic') || query.contains('equation')) {
      return r"The quadratic formula is used to solve quadratic equations of the form $ax^2 + bx + c = 0$.\n\nThe solution is given by:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\nWhere the discriminant $b^2 - 4ac$ determines the number of real solutions.";
    }

    if (query.contains('pythagoras') || query.contains('pythagorean')) {
      return r"The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides.\n\n$$c^2 = a^2 + b^2$$\n\nWhere $c$ is the hypotenuse, and $a$ and $b$ are the other two sides.";
    }

    if (query.contains('integral') || query.contains('calculus')) {
      return r"In calculus, integration is the process of finding the area under a curve. The indefinite integral of a function $f(x)$ is written as:\n\n$$\\int f(x) dx = F(x) + C$$\n\nWhere $F(x)$ is the antiderivative of $f(x)$ and $C$ is the constant of integration.";
    }

    // Default response
    return "I understand you're asking about \"$query\". This is an important topic in its field.\n\nTo answer your question thoroughly, I would need to provide context, definitions, and examples.\n\nWould you like me to elaborate on any specific aspect of this topic or provide a more detailed explanation?";
  }

  // UI COMPONENTS - MOVED INSIDE THE CLASS
  Widget _buildWelcomeScreen() {
    return Column(
      children: [
        // Subject selection
        Container(
          padding: const EdgeInsets.all(16),
          color: backgroundColor,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Select a subject for your question:',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _subjects.map((subject) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(subject),
                        selected: _selectedSubject == subject,
                        onSelected: (selected) {
                          setState(() {
                            _selectedSubject = selected ? subject : null;
                          });
                        },
                        selectedColor: studentPrimaryColor,
                        labelStyle: TextStyle(
                          color: _selectedSubject == subject
                              ? Colors.white
                              : Colors.black87,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),

        // AI capabilities
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'I can help with:',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    childAspectRatio: 1.5,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    children: _buildCapabilityCards(),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Previous conversations:',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _isLoading
                      ? Center(
                          child: CircularProgressIndicator(
                              color: studentPrimaryColor))
                      : _previousChats.isEmpty
                          ? Center(
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Text(
                                  'No previous conversations found.\nStart a new chat to see history here.',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(color: Colors.grey[600]),
                                ),
                              ),
                            )
                          : Column(
                              children: _previousChats
                                  .take(3) // Show just a few recent chats
                                  .map((chat) => _buildChatHistoryItem(chat))
                                  .toList(),
                            ),
                  if (_previousChats.length > 3)
                    Align(
                      alignment: Alignment.center,
                      child: TextButton(
                        onPressed: _toggleSidebar,
                        child: Text(
                          'View all conversations',
                          style: TextStyle(color: studentPrimaryColor),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildChatMessages() {
    final responses = _selectedChat?['responses'] ?? [];
    final equations = _selectedChat?['equations'] ?? [];

    return Column(
      children: [
        // Your existing header code...

        // Chat messages
        Expanded(
          child: responses.isEmpty
              ? Center(
                  child: Text(
                    'No messages yet. Start typing to chat!',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: responses.length + equations.length,
                  itemBuilder: (context, index) {
                    // Show equations in sequence with responses
                    if (index < responses.length) {
                      final response = responses[index];
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // User's message
                          _buildUserMessage(response['prompt']),
                          const SizedBox(height: 16),
                          // AI's response
                          _buildAIResponse(response['output']),
                          const SizedBox(height: 24),

                          // Show equation if it exists for this message
                          if (index < equations.length &&
                              equations[index]['rendered'] != null)
                            _buildMathEquationCard(
                                equations[index]['rendered']),
                        ],
                      );
                    } else {
                      // Show remaining equations
                      final equationIndex = index - responses.length;
                      if (equationIndex < equations.length &&
                          equations[equationIndex]['rendered'] != null) {
                        return _buildMathEquationCard(
                            equations[equationIndex]['rendered']);
                      }
                      return SizedBox.shrink();
                    }
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildUserMessage(String message) {
    return Align(
      alignment: Alignment.centerRight,
      child: Container(
        constraints: BoxConstraints(maxWidth: 300),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: studentPrimaryColor,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(16),
            bottomLeft: Radius.circular(16),
            bottomRight: Radius.circular(16),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Text(
          message,
          style: const TextStyle(color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildAIResponse(String message) {
    if (message.isEmpty) {
      return _buildTypingBubble();
    }

    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(maxWidth: 300),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(16),
            bottomLeft: Radius.circular(16),
            bottomRight: Radius.circular(16),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: _buildRichMathContent(message),
      ),
    );
  }

  Widget _buildRichMathContent(String content) {
    // Handle empty content
    if (content.isEmpty) {
      return Text('', style: TextStyle(color: textColor, fontSize: 16));
    }

    // Quick check if there's any math content
    if (!content.contains(r'$')) {
      return Text(content,
          style: TextStyle(color: textColor, fontSize: 16, height: 1.5));
    }

    try {
      // Regex patterns for math expressions
      final blockMathPattern = RegExp(r'\$\$(.*?)\$\$', dotAll: true);
      final inlineMathPattern = RegExp(r'\$(.*?)\$', dotAll: true);

      // Split the content to separate text from math expressions
      List<InlineSpan> spans = [];

      // Get all block math matches
      List<RegExpMatch> blockMatches =
          blockMathPattern.allMatches(content).toList();

      // Split content by block math expressions
      List<String> parts = [];
      int lastEnd = 0;

      for (var match in blockMatches) {
        if (match.start > lastEnd) {
          parts.add(content.substring(lastEnd, match.start));
        }
        parts.add(content.substring(match.start, match.end));
        lastEnd = match.end;
      }

      if (lastEnd < content.length) {
        parts.add(content.substring(lastEnd));
      }

      // If no blocks were found, just process the whole string
      if (parts.isEmpty) {
        parts = [content];
      }

      // Process each part
      for (var part in parts) {
        if (part.startsWith('\$\$') && part.endsWith('\$\$')) {
          // This is a block math expression
          final formula = part.substring(2, part.length - 2).trim();
          spans.add(
            WidgetSpan(
              child: Container(
                width: double.infinity,
                padding: EdgeInsets.symmetric(vertical: 8),
                alignment: Alignment.center,
                child: Math.tex(
                  formula,
                  textStyle: TextStyle(fontSize: 18),
                  onErrorFallback: (e) {
                    // Instead of returning a single Text with \n characters
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Couldn't render formula:",
                            style: TextStyle(
                                color: Colors.red,
                                fontWeight: FontWeight.bold)),
                        SizedBox(height: 4),
                        Text(formula,
                            style: TextStyle(fontFamily: 'monospace')),
                      ],
                    );
                  },
                ),
              ),
            ),
          );
        } else {
          // Process inline math in this text part
          List<RegExpMatch> inlineMatches =
              inlineMathPattern.allMatches(part).toList();

          if (inlineMatches.isEmpty) {
            // No inline math, just add text
            spans.add(TextSpan(text: part));
          } else {
            // Process text with inline math
            int lastInlineEnd = 0;

            for (var match in inlineMatches) {
              if (match.start > lastInlineEnd) {
                spans.add(
                    TextSpan(text: part.substring(lastInlineEnd, match.start)));
              }

              final formula =
                  part.substring(match.start + 1, match.end - 1).trim();
              spans.add(
                WidgetSpan(
                  alignment: PlaceholderAlignment.middle,
                  child: Math.tex(
                    formula,
                    textStyle: TextStyle(fontSize: 16),
                    onErrorFallback: (e) =>
                        Text(part.substring(match.start, match.end)),
                  ),
                ),
              );

              lastInlineEnd = match.end;
            }

            if (lastInlineEnd < part.length) {
              spans.add(TextSpan(text: part.substring(lastInlineEnd)));
            }
          }
        }
      }

      // Return the rendered content
      return RichText(
        text: TextSpan(
          style: TextStyle(color: textColor, fontSize: 16, height: 1.5),
          children: spans,
        ),
      );
    } catch (_) {
      // If anything fails, just show plain text
      return Text(content,
          style: TextStyle(color: textColor, fontSize: 16, height: 1.5));
    }
  }

  Widget _buildTypingBubble() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(maxWidth: 100),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(16),
            bottomLeft: Radius.circular(16),
            bottomRight: Radius.circular(16),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            _buildDot(),
            const SizedBox(width: 5),
            _buildDot(),
            const SizedBox(width: 5),
            _buildDot(),
          ],
        ),
      ),
    );
  }

  Widget _buildDot() {
    return AnimatedBuilder(
      animation: _typingController,
      builder: (context, child) {
        final double opacity =
            sin(_typingController.value * pi * 2) * 0.5 + 0.5;
        return Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: Colors.grey.withOpacity(opacity),
            shape: BoxShape.circle,
          ),
        );
      },
    );
  }

  Widget _buildTypingIndicator() {
    return Positioned(
      left: 0,
      right: 0,
      bottom: 0,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        color: Colors.black.withOpacity(0.7),
        child: Row(
          children: [
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'AI is thinking...',
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSidebar() {
    return Positioned(
      top: 0,
      bottom: 0,
      right: 0,
      width: MediaQuery.of(context).size.width * 0.75,
      child: GestureDetector(
        onTap: () {},
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                offset: Offset(-5, 0),
              ),
            ],
          ),
          child: Column(
            children: [
              // Sidebar header
              Container(
                padding: const EdgeInsets.all(16),
                color: studentPrimaryColor,
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Chat History',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.close),
                      onPressed: _toggleSidebar,
                      color: Colors.white,
                    ),
                  ],
                ),
              ),

              // Search box
              Padding(
                padding: const EdgeInsets.all(16),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Search conversations',
                    prefixIcon: Icon(Icons.search),
                    fillColor: Colors.grey[100],
                    filled: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onChanged: _searchChats,
                ),
              ),

              // Chat history list
              Expanded(
                child: _isLoading
                    ? Center(
                        child: CircularProgressIndicator(
                            color: studentPrimaryColor))
                    : _previousChats.isEmpty
                        ? Center(
                            child: Text(
                              'No chat history found',
                              style: TextStyle(color: Colors.grey[600]),
                            ),
                          )
                        : ListView.builder(
                            itemCount: _previousChats.length,
                            itemBuilder: (context, index) {
                              return _buildChatHistoryItem(
                                  _previousChats[index]);
                            },
                          ),
              ),

              // New chat button
              Padding(
                padding: const EdgeInsets.all(16),
                child: ElevatedButton.icon(
                  onPressed: () {
                    _createNewChat();
                    _toggleSidebar();
                  },
                  icon: Icon(Icons.add),
                  label: Text('New Chat'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: studentPrimaryColor,
                    foregroundColor: Colors.white,
                    minimumSize: Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChatHistoryItem(Map<String, String> chat) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(
          chat['prompt'] ?? 'Untitled Chat',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(chat['date'] ?? ''),
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: studentPrimaryColor.withOpacity(0.2),
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.chat, color: studentPrimaryColor),
        ),
        onTap: () => _selectChat(chat['chatId'] ?? ''),
      ),
    );
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
              onTap: _pickAttachment,
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

          // Text input field
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(24),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: InputDecoration(
                        hintText: 'Type your question here...',
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.fromLTRB(20, 10, 12, 10),
                      ),
                      maxLines: 5,
                      minLines: 1,
                      textCapitalization: TextCapitalization.sentences,
                    ),
                  ),

                  // Camera button
                  Material(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(30),
                    child: InkWell(
                      onTap: _takePicture,
                      borderRadius: BorderRadius.circular(30),
                      child: Container(
                        padding: EdgeInsets.all(10),
                        child: Icon(
                          Icons.camera_alt_rounded,
                          color: Colors.grey[600],
                          size: 22,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Send button
          SizedBox(width: 8),
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

  Widget _buildMathEquationCard(String equation) {
    return Card(
      elevation: 2,
      color: Colors.grey[50],
      margin: EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.functions, color: studentPrimaryColor, size: 18),
                SizedBox(width: 8),
                Text(
                  "Equation Result",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: studentPrimaryColor,
                  ),
                ),
                Spacer(),
                InkWell(
                  onTap: () {
                    // Copy equation to clipboard
                    Clipboard.setData(ClipboardData(text: equation));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Equation copied to clipboard'),
                        duration: Duration(seconds: 1),
                      ),
                    );
                  },
                  child: Padding(
                    padding: EdgeInsets.all(4),
                    child: Icon(Icons.copy, size: 16),
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Container(
              width: double.infinity,
              alignment: Alignment.center,
              child: Math.tex(
                equation,
                textStyle: TextStyle(fontSize: 18),
                onErrorFallback: (e) => Text(equation),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildCapabilityCards() {
    return _capabilities.map((capability) {
      return Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                capability['icon'] as IconData,
                color: capability['color'] as Color,
                size: 28,
              ),
              const SizedBox(height: 8),
              Text(
                capability['title'] as String,
                textAlign: TextAlign.center,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      );
    }).toList();
  }
}
