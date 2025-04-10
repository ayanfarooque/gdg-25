import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';

import '../components/header.dart';
import '../components/footer.dart';
import '../components/assignmentSidebar.dart';

class AssignmentLanding extends StatefulWidget {
  @override
  State<AssignmentLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<AssignmentLanding> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  int _selectedIndex = 1;
  String? _selectedFileName;
  String? _selectedAssignment;
  List<Map<String, dynamic>> _pendingAssignments = [];
  List<Map<String, dynamic>> _submittedAssignments = [];
  bool _isSidebarVisible = false;

  @override
  void initState() {
    super.initState();
    _loadAssignments();
  }

  Future<void> _loadAssignments() async {
    final String response =
        await rootBundle.loadString('lib/data/assignment.json');
    final List<dynamic> data = json.decode(response);

    setState(() {
      _pendingAssignments = data
          .where((assignment) => !assignment['isCompleted'])
          .map((assignment) => {
                'id': assignment['id'],
                'title': assignment['title'],
                'dueDate': assignment['dueDate'],
                'subjectId': assignment['subjectId'],
                'teacherId': assignment['teacherId'],
                'classroomId': assignment['classroomId'],
                'description': assignment['description'],
                'attachments': assignment['attachments'],
                'gradingCriteria': assignment['gradingCriteria'],
                'createdAt': assignment['createdAt'],
                'updatedAt': assignment['updatedAt'],
              })
          .toList();

      _submittedAssignments = data
          .where((assignment) => assignment['isCompleted'])
          .map((assignment) => {
                'id': assignment['id'],
                'title': assignment['title'],
                'dueDate': assignment['dueDate'],
                'subjectId': assignment['subjectId'],
                'teacherId': assignment['teacherId'],
                'classroomId': assignment['classroomId'],
                'description': assignment['description'],
                'attachments': assignment['attachments'],
                'gradingCriteria': assignment['gradingCriteria'],
                'createdAt': assignment['createdAt'],
                'updatedAt': assignment['updatedAt'],
              })
          .toList();
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    // Navigate to different pages based on index
    switch (index) {
      case 0:
        Navigator.pushNamed(context, '/');
        break;
      case 1:
        Navigator.pushNamed(context, '/assignment');
        break;
      case 2:
        Navigator.pushNamed(context, '/community');
        break;
      case 3:
        Navigator.pushNamed(context, '/aibot');
        break;
      case 4:
        Navigator.pushNamed(context, '/resources');
        break;
    }
  }

  Future<void> _selectFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      setState(() {
        _selectedFileName = result.files.single.name;
      });
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
      key: _scaffoldKey,
      backgroundColor: const Color.fromARGB(255, 73, 171, 176),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: const Color.fromARGB(255, 73, 171, 176),
              ),
              child: Text(
                'Assignments',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              title: Text('Pending Assignments'),
              onTap: () {},
            ),
            ..._pendingAssignments.map((assignment) {
              return ListTile(
                title: Text(assignment['title']),
                subtitle: Text(
                    'Due: ${DateFormat('dd MMM yyyy').format(DateTime.parse(assignment['dueDate']))}'),
                onTap: () {
                  // Handle the tap event here
                  Navigator.pop(context);
                },
              );
            }).toList(),
            ListTile(
              title: Text('Submitted Assignments'),
              onTap: () {},
            ),
            ..._submittedAssignments.map((assignment) {
              return ListTile(
                title: Text(assignment['title']),
                subtitle: Text(
                    'Submitted on: ${DateFormat('dd MMM yyyy').format(DateTime.parse(assignment['updatedAt']))}'),
                onTap: () {
                  // Handle the tap event here
                  Navigator.pop(context);
                },
              );
            }).toList(),
          ],
        ),
      ),
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
                    child: Header(
                      onProfileTap: () {
                        Navigator.pushNamed(context, '/profile');
                      },
                      onNotificationTap: () {
                        Navigator.pushNamed(context, '/notifications');
                      },
                      profileImage: 'assets/images/image3.png',
                      welcomeText: "WELCOME HASHIM",
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
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
                          margin: EdgeInsets.fromLTRB(45.0, 10.0, 0.0, 0.0),
                          decoration: BoxDecoration(),
                          child: Row(
                            children: [
                              SizedBox(
                                width: 30,
                                height: 30,
                                child: IconButton(
                                  onPressed: _toggleSidebar,
                                  icon: Icon(
                                    Icons.menu,
                                    size: 30,
                                  ),
                                  padding: EdgeInsets.zero,
                                  constraints: BoxConstraints(),
                                ),
                              )
                            ],
                          ),
                        ),
                        const SizedBox(height: 15),
                        Container(
                          width: 330,
                          height: 290,
                          padding: EdgeInsets.all(8.0),
                          margin: EdgeInsets.all(4.0),
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 245, 245, 221),
                            borderRadius: BorderRadius.circular(30),
                            boxShadow: [
                              BoxShadow(color: Colors.grey, blurRadius: 4)
                            ],
                          ),
                          child: Column(
                            children: [
                              Text(
                                'AI ASSIGNMENT BOT',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                ),
                              ),
                              const SizedBox(height: 15),
                              Container(
                                padding: EdgeInsets.all(8.0),
                                margin: EdgeInsets.all(4.0),
                                width: 250,
                                height: 112,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(25),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.grey.withOpacity(0.5),
                                      spreadRadius: 2,
                                      blurRadius: 5,
                                      offset: Offset(0, 3),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    ElevatedButton(
                                      onPressed: _selectFile,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor:
                                            const Color(0xFF49ABB0),
                                        elevation: 8,
                                        shadowColor: Colors.black,
                                      ),
                                      child: const Text(
                                        "SELECT FILE",
                                        style: TextStyle(color: Colors.black),
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      _selectedFileName ??
                                          "Drop your file here",
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.black54,
                                      ),
                                    ),
                                    const SizedBox(height: 5),
                                    Text(
                                      "PDF, JPG, JPEG, PNG",
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.black54,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 10),
                              Container(
                                padding: EdgeInsets.all(8.0),
                                margin: EdgeInsets.all(4.0),
                                width: 160, // Adjusted width
                                height: 35, // Adjusted height
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(15),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.grey.withOpacity(0.5),
                                      spreadRadius: 2,
                                      blurRadius: 5,
                                      offset: Offset(0, 3),
                                    ),
                                  ],
                                ),
                                child: DropdownButtonHideUnderline(
                                  child: DropdownButton<String>(
                                    value: _selectedAssignment,
                                    hint: Text(
                                      "Select assignment",
                                      style:
                                          TextStyle(fontFamily: 'CustomFont'),
                                    ),
                                    icon: Icon(Icons.arrow_drop_down),
                                    iconSize: 24,
                                    elevation: 16,
                                    style: TextStyle(color: Colors.black),
                                    isExpanded:
                                        true, // Ensures the icon is aligned to the right
                                    onChanged: (String? newValue) {
                                      setState(() {
                                        _selectedAssignment = newValue;
                                      });
                                    },
                                    items: _pendingAssignments
                                        .map<DropdownMenuItem<String>>(
                                            (assignment) {
                                      return DropdownMenuItem<String>(
                                        value: assignment['title'],
                                        child: Text(assignment['title']),
                                      );
                                    }).toList(),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 10),
                              ElevatedButton(
                                onPressed: () {},
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF49ABB0),
                                  elevation: 8,
                                  shadowColor: Colors.black,
                                ),
                                child: const Text(
                                  "SUBMIT",
                                  style: TextStyle(color: Colors.black),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 10),
                        Container(
                          width: 330,
                          height: 350,
                          padding: EdgeInsets.all(8.0),
                          margin: EdgeInsets.all(4.0),
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 245, 245, 221),
                            borderRadius: BorderRadius.circular(30),
                            boxShadow: [
                              BoxShadow(color: Colors.grey, blurRadius: 4)
                            ],
                          ),
                          child: Column(
                            children: [
                              Text("REVIEW"),
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
              child: AssignmentSidebar(
                pendingAssignments: _pendingAssignments.map((assignment) {
                  return {
                    'date': DateFormat('dd MMM')
                        .format(DateTime.parse(assignment['dueDate'])),
                    'subjectCode': assignment['title'].toString(),
                    'assignmentId': assignment['id'].toString()
                  };
                }).toList(),
                submittedAssignments: _submittedAssignments.map((assignment) {
                  return {
                    'date': DateFormat('dd MMM')
                        .format(DateTime.parse(assignment['updatedAt'])),
                    'subjectCode': assignment['title'].toString(),
                    'assignmentId': assignment['id'].toString()
                  };
                }).toList(),
                onClose: _toggleSidebar,
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
}
