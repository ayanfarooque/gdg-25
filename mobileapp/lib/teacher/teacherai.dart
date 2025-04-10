import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

import '../components/teacherheader.dart';
import '../components/footer.dart';
import '../components/facaisidebar.dart';

class TeacherAi extends StatefulWidget {
  @override
  State<TeacherAi> createState() => _LandingPageState();
}

class _LandingPageState extends State<TeacherAi> {
  int _selectedIndex = 1;
  TextEditingController _messageController = TextEditingController();
  String? _selectedSubject;
  List<String> _subjects = ["Math", "Science", "History"];
  bool _isSidebarVisible = false;

  // Replace the dummy previous chats with data that will be loaded from JSON
  List<Map<String, String>> _previousChats = [];
  // Store the full chat data for detailed view
  List<dynamic> _fullChatData = [];
  Map<String, dynamic>? _selectedChat;

  @override
  void initState() {
    super.initState();
    loadChatData();
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
        Navigator.pushNamed(context, '/teacherhome');
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
        break;
    }
  }

  void _toggleSidebar() {
    setState(() {
      _isSidebarVisible = !_isSidebarVisible;
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
                      welcomeText: "WELCOME SENSEI",
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    height: 705,
                    width: 420,
                    margin: const EdgeInsets.fromLTRB(0.0, 30.0, 0.0, 0.0),
                    padding: const EdgeInsets.fromLTRB(4.0, 12.0, 4.0, 12.0),
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 236, 231, 202),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: Column(
                      children: [
                        Container(
                          margin: EdgeInsets.fromLTRB(40.0, 10.0, 0.0, 0.0),
                          decoration: BoxDecoration(),
                          child: Row(
                            children: [
                              SizedBox(
                                width: 30,
                                height: 30,
                                child: IconButton(
                                  onPressed: _toggleSidebar,
                                  icon: Icon(Icons.menu, size: 30),
                                  padding: EdgeInsets.zero,
                                  constraints: BoxConstraints(),
                                ),
                              ),
                              if (_selectedChat != null) ...[
                                SizedBox(width: 20),
                                Text(
                                  'Chat: ${_selectedChat!['chatId']}',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                              ],
                            ],
                          ),
                        ),
                        const SizedBox(height: 15),
                        Container(
                          width: 330,
                          height: 250,
                          padding: EdgeInsets.all(8.0),
                          margin: EdgeInsets.all(4.0),
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 245, 245, 221),
                            borderRadius: BorderRadius.circular(30),
                            boxShadow: [
                              BoxShadow(color: Colors.grey, blurRadius: 4)
                            ],
                          ),
                          child: _selectedChat != null
                              ? _buildChatMessages(_selectedChat!)
                              : Column(
                                  children: [
                                    const SizedBox(height: 15),
                                    Text('What can I help you with ?'),
                                    const SizedBox(height: 15),
                                    Container(
                                      padding: EdgeInsets.fromLTRB(
                                          12.0, 8.0, 8.0, 8.0),
                                      margin: EdgeInsets.all(4.0),
                                      width: 304,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(25),
                                        boxShadow: [
                                          BoxShadow(
                                              color: Colors.grey, blurRadius: 4)
                                        ],
                                      ),
                                      child: Row(
                                        children: [
                                          Expanded(
                                            child: TextField(
                                              controller: _messageController,
                                              decoration: InputDecoration(
                                                hintText:
                                                    "Message or Ask Doubt",
                                                border: InputBorder.none,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 10),
                                          SizedBox(
                                            width: 20,
                                            height: 20,
                                            child: IconButton(
                                              onPressed: () {
                                                // Handle camera action
                                              },
                                              icon: Icon(
                                                Icons.camera_enhance,
                                                size: 20,
                                                color: Colors.black,
                                              ),
                                              padding: EdgeInsets.zero,
                                              constraints: BoxConstraints(),
                                            ),
                                          ),
                                          const SizedBox(width: 10),
                                          SizedBox(
                                            width: 20,
                                            height: 20,
                                            child: IconButton(
                                              onPressed: () {
                                                // Handle send action
                                                print(_messageController.text);
                                              },
                                              icon: Icon(
                                                Icons.arrow_upward_outlined,
                                                size: 20,
                                                color: Colors.black,
                                              ),
                                              padding: EdgeInsets.zero,
                                              constraints: BoxConstraints(),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 15),
                                    Container(
                                      padding: EdgeInsets.all(8.0),
                                      margin: EdgeInsets.all(4.0),
                                      width: 180,
                                      height: 35,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(15),
                                        boxShadow: [
                                          BoxShadow(
                                              color: Colors.grey, blurRadius: 4)
                                        ],
                                      ),
                                      child: DropdownButtonHideUnderline(
                                        child: DropdownButton<String>(
                                          value: _selectedSubject,
                                          hint: Text(
                                            "Select Subject",
                                            style: TextStyle(
                                                fontFamily: 'CustomFont',
                                                fontSize: 14,
                                                fontWeight: FontWeight.w100),
                                          ),
                                          icon: Icon(Icons.arrow_drop_down),
                                          iconSize: 24,
                                          elevation: 16,
                                          style: TextStyle(color: Colors.black),
                                          onChanged: (String? newValue) {
                                            setState(() {
                                              _selectedSubject = newValue;
                                            });
                                          },
                                          items: _subjects
                                              .map<DropdownMenuItem<String>>(
                                                  (String value) {
                                            return DropdownMenuItem<String>(
                                              value: value,
                                              child: Text(value),
                                            );
                                          }).toList(),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 20),
                                    Container(
                                      padding: EdgeInsets.fromLTRB(
                                          12.0, 4.0, 12.0, 4.0),
                                      child: Row(
                                        children: [
                                          _buildActionButton(
                                            "Concepts",
                                            'lib/images/concepts.png',
                                            () {
                                              // Handle Concepts action
                                            },
                                          ),
                                          const SizedBox(width: 12),
                                          _buildActionButton(
                                            "Numericals",
                                            'lib/images/numericals.png',
                                            () {
                                              // Handle Numericals action
                                            },
                                          ),
                                          const SizedBox(width: 12),
                                          _buildActionButton(
                                            "Summarize",
                                            'lib/images/summarize.png',
                                            () {
                                              // Handle Summarize action
                                            },
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                        const SizedBox(height: 10),
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
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  // Build chat messages from the selected chat
  Widget _buildChatMessages(Map<String, dynamic> chatData) {
    if (chatData['responses'] == null || chatData['responses'].isEmpty) {
      return Center(child: Text('No messages in this chat'));
    }

    return ListView.builder(
      itemCount: chatData['responses'].length,
      itemBuilder: (context, index) {
        final response = chatData['responses'][index];
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Question bubble
            Container(
              padding: EdgeInsets.all(8),
              margin: EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(15),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Question:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(response['prompt']),
                ],
              ),
            ),

            // Answer bubble
            Container(
              padding: EdgeInsets.all(8),
              margin: EdgeInsets.only(bottom: 12, left: 16),
              decoration: BoxDecoration(
                color: Colors.lightBlue[100],
                borderRadius: BorderRadius.circular(15),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Answer:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(response['output']),
                  if (response['fileUrl'] != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        'Attachment',
                        style: TextStyle(
                          color: Colors.blue,
                          decoration: TextDecoration.underline,
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

  Widget _buildActionButton(
      String text, String imagePath, VoidCallback onPressed) {
    return Container(
      padding: EdgeInsets.fromLTRB(4.0, 0.0, 0.0, 0.0),
      width: 80,
      height: 25,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(),
      ),
      child: Row(
        children: [
          Text(
            text,
            style: TextStyle(fontSize: 10),
          ),
          SizedBox(
            width: 20,
            height: 20,
            child: IconButton(
              onPressed: onPressed,
              icon: Image.asset(
                imagePath,
                width: 20,
                height: 20,
                fit: BoxFit.cover,
              ),
              padding: EdgeInsets.zero,
              constraints: BoxConstraints(),
            ),
          ),
        ],
      ),
    );
  }
}
