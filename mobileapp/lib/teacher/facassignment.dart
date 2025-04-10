import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';

import '../components/teacherheader.dart';
import '../components/footer.dart';
import '../components/assignmentSidebar.dart';

class FacAssignmentLanding extends StatefulWidget {
  @override
  State<FacAssignmentLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<FacAssignmentLanding> {
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

  Widget _buildScoreBox(
      String studentName, String assignmentTitle, String score) {
    // Parse the score to determine the background color
    final scoreValue = int.tryParse(score.split('/')[0]) ?? 0;
    final totalValue = int.tryParse(score.split('/')[1]) ?? 100;
    final scorePercent = (scoreValue / totalValue) * 100;

    Color scoreColor;
    if (scorePercent >= 90) {
      scoreColor = Colors.green.shade100;
    } else if (scorePercent >= 80) {
      scoreColor = Colors.lightBlue.shade100;
    } else if (scorePercent >= 70) {
      scoreColor = Colors.amber.shade100;
    } else {
      scoreColor = Colors.deepOrange.shade100;
    }

    return Container(
      padding: EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 3,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  studentName,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  assignmentTitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade700,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: scoreColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              score,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ),
        ],
      ),
    );
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
      backgroundColor: const Color(0xFFE195AB),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: const Color(0xFFE195AB),
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
                    child: TeacherHeader(
                      onProfileTap: () {
                        Navigator.pushNamed(context, '/teacherprofile');
                      },
                      onNotificationTap: () {
                        Navigator.pushNamed(context, '/notifications');
                      },
                      profileImage: 'lib/images/teacher.png',
                      welcomeText: "WELCOME SENSEI",
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
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16.0, vertical: 8.0),
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () {
                              Navigator.pushNamed(context, '/addassignment');
                            },
                            icon: const Icon(Icons.add_circle_outline,
                                color: Colors.white),
                            label: const Text(
                              "CREATE NEW ASSIGNMENT",
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFE195AB),
                              padding:
                                  const EdgeInsets.symmetric(vertical: 16.0),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15),
                              ),
                              elevation: 6,
                              shadowColor: Colors.black54,
                            ),
                          ),
                        ),
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
                                            const Color(0xFFE195AB),
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
                                  backgroundColor: const Color(0xFFE195AB),
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
                              Container(
                                width: 330,
                                padding: EdgeInsets.all(16.0),
                                margin: EdgeInsets.all(4.0),
                                decoration: BoxDecoration(
                                  color:
                                      const Color.fromARGB(255, 245, 245, 221),
                                  borderRadius: BorderRadius.circular(30),
                                  boxShadow: [
                                    BoxShadow(color: Colors.grey, blurRadius: 4)
                                  ],
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Center(
                                      child: Text(
                                        "ASSIGNMENT SCORES",
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black87,
                                        ),
                                      ),
                                    ),
                                    SizedBox(height: 20),
                                    Text(
                                      "Latest Submissions",
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.black54,
                                      ),
                                    ),
                                    SizedBox(height: 10),

                                    // Assignment score boxes
                                    _buildScoreBox("Rahul Sharma",
                                        "Science Assignment 1", "92/100"),
                                    SizedBox(height: 8),
                                    _buildScoreBox("Priya Singh",
                                        "Science Assignment 1", "88/100"),
                                    SizedBox(height: 8),
                                    _buildScoreBox("Neha Patel",
                                        "Science Assignment 1", "95/100"),
                                    SizedBox(height: 8),
                                    _buildScoreBox("Arjun Verma",
                                        "Science Assignment 1", "78/100"),
                                    SizedBox(height: 8),
                                    _buildScoreBox("Arun Kumar",
                                        "Science Assignment 1", "85/100"),

                                    SizedBox(height: 20),
                                    Center(
                                      child: ElevatedButton.icon(
                                        onPressed: () {
                                          Navigator.pushNamed(context,
                                              '/teacher/assignment-checker');
                                        },
                                        icon: Icon(Icons.grading,
                                            color: Colors.white),
                                        label: Text(
                                          "CHECK MORE ASSIGNMENTS",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14,
                                          ),
                                        ),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor:
                                              const Color(0xFFE195AB),
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 16, vertical: 12),
                                          elevation: 5,
                                          shadowColor: Colors.black45,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(15),
                                          ),
                                        ),
                                      ),
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
