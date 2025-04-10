import 'package:flutter/material.dart';
//import 'package:shared_preferences/shared_preferences.dart';
//import 'dart:convert';
import '../components/teacherheader.dart';
import '../components/footer.dart';

class TeacherProfilePage extends StatefulWidget {
  const TeacherProfilePage({Key? key}) : super(key: key);

  @override
  State<TeacherProfilePage> createState() => _TeacherProfilePageState();
}

class _TeacherProfilePageState extends State<TeacherProfilePage> {
  int _selectedIndex = 4; // Profile tab is selected
  Map<String, dynamic> _teacherData = {};
  bool _isLoading = true;
  String _selectedClass = 'Class A';
  String _selectedStudent = 'All Students';
  List<String> _classes = ['Class A', 'Class B', 'Class C'];
  List<String> _students = [
    'All Students',
    'Arun Kumar',
    'Priya Singh',
    'Rahul Sharma',
    'Neha Patel',
    'Arjun Verma'
  ];

  @override
  void initState() {
    super.initState();
    _loadTeacherData();
  }

  void _loadTeacherData() async {
    // In a real application, you would fetch this data from your API
    // For this example, we'll simulate loading data
    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _teacherData = {
        "id": "T12345",
        "name": "Dr. Rajesh Sharma",
        "email": "rajesh.sharma@nastavnik.edu",
        "subject": "Physics",
        "qualification": "Ph.D. in Theoretical Physics",
        "joinDate": "2018-07-15",
        "phone": "+91 9876543210",
        "address": "403, Sunrise Apartments, Bandra West, Mumbai - 400050",
        "department": "Science Department",
        "profileImage": "lib/images/teacher.png",
        "assignmentsCreated": 45,
        "assignmentsGraded": 42,
        "studentsManaged": 120,
        "avgResponseTime": "1.5 days",
        "activeCourses": 3
      };
      _isLoading = false;
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    // Navigate based on the tapped item
    switch (index) {
      case 0:
        Navigator.pushReplacementNamed(context, '/teacher');
        break;
      case 1:
        Navigator.pushReplacementNamed(context, '/teacher/assignments');
        break;
      case 2:
        Navigator.pushReplacementNamed(context, '/teacher/community');
        break;
      case 3:
        Navigator.pushReplacementNamed(context, '/teacher/aibot');
        break;
      case 4:
        // Already on profile page
        break;
    }
  }

  void _downloadResults() {
    // Show a loading indicator
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            SizedBox(width: 16),
            Text(
                'Downloading results for ${_selectedStudent} from ${_selectedClass}...'),
          ],
        ),
        duration: Duration(seconds: 2),
      ),
    );

    // Simulate download completion after a delay
    Future.delayed(Duration(seconds: 2), () {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Results downloaded successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE195AB), // Teacher color
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          : SingleChildScrollView(
              child: Column(
                children: [
                  // Header
                  TeacherHeader(
                    onProfileTap: () {},
                    onNotificationTap: () {
                      Navigator.pushNamed(context, '/teacher/notifications');
                    },
                    profileImage: _teacherData["profileImage"] ??
                        'lib/images/teacher.png',
                    welcomeText: "TEACHER PROFILE",
                  ),
                  const SizedBox(height: 20),

                  // Profile content
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.fromLTRB(0, 30, 0, 0),
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 245, 245, 221),
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(30),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Profile image
                        Transform.translate(
                          offset: const Offset(0, -50),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: const Color(0xFFE195AB),
                                width: 4,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  spreadRadius: 5,
                                  blurRadius: 10,
                                  offset: const Offset(0, 3),
                                ),
                              ],
                            ),
                            child: CircleAvatar(
                              radius: 60,
                              backgroundImage: AssetImage(
                                _teacherData["profileImage"] ??
                                    'lib/images/teacher.png',
                              ),
                            ),
                          ),
                        ),

                        // Name and ID
                        Transform.translate(
                          offset: const Offset(0, -30),
                          child: Column(
                            children: [
                              Text(
                                _teacherData["name"] ?? "Teacher Name",
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text(
                                "ID: ${_teacherData["id"] ?? ""}",
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey[600],
                                ),
                              ),
                              const SizedBox(height: 5),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color:
                                      const Color(0xFFE195AB).withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  _teacherData["subject"] ?? "Subject",
                                  style: const TextStyle(
                                    color: Color(0xFFE195AB),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Stats row
                        Container(
                          margin: const EdgeInsets.only(bottom: 20),
                          padding: const EdgeInsets.all(15),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(15),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                spreadRadius: 1,
                                blurRadius: 5,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              _buildStatColumn("Assignments",
                                  "${_teacherData["assignmentsCreated"] ?? 0}"),
                              _buildDivider(),
                              _buildStatColumn("Students",
                                  "${_teacherData["studentsManaged"] ?? 0}"),
                              _buildDivider(),
                              _buildStatColumn("Courses",
                                  "${_teacherData["activeCourses"] ?? 0}"),
                            ],
                          ),
                        ),

                        // Performance insights
                        _buildInfoSection(
                          "Teaching Performance",
                          [
                            [
                              "Assignments Graded",
                              "${_teacherData["assignmentsGraded"] ?? 0}"
                            ],
                            [
                              "Average Response Time",
                              _teacherData["avgResponseTime"] ?? "N/A"
                            ],
                          ],
                          const Icon(
                            Icons.analytics,
                            color: Color(0xFFE195AB),
                            size: 24,
                          ),
                        ),

                        // Personal info
                        _buildInfoSection(
                          "Personal Information",
                          [
                            ["Email", _teacherData["email"] ?? "N/A"],
                            ["Phone", _teacherData["phone"] ?? "N/A"],
                            ["Department", _teacherData["department"] ?? "N/A"],
                            [
                              "Qualification",
                              _teacherData["qualification"] ?? "N/A"
                            ],
                            [
                              "Joined On",
                              _formatDate(_teacherData["joinDate"])
                            ],
                            ["Address", _teacherData["address"] ?? "N/A"],
                          ],
                          const Icon(
                            Icons.person,
                            color: Color(0xFFE195AB),
                            size: 24,
                          ),
                        ),

                        // Student Result Download Card
                        _buildResultDownloadCard(),

                        // Edit Profile button
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 20.0),
                          child: ElevatedButton(
                            onPressed: () {
                              // Handle edit profile action
                              Navigator.pushNamed(
                                  context, '/teacher/edit-profile');
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFE195AB),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 30,
                                vertical: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30),
                              ),
                              elevation: 5,
                            ),
                            child: const Text(
                              "EDIT PROFILE",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
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
      // Bottom Navigation Bar
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 40,
      width: 1,
      color: Colors.grey.withOpacity(0.5),
    );
  }

  Widget _buildStatColumn(String title, String value) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 5),
        Text(
          title,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoSection(
    String title,
    List<List<String>> items,
    Icon icon,
  ) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              icon,
              const SizedBox(width: 10),
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
          const SizedBox(height: 15),
          ...items.map((item) => _buildInfoRow(item[0], item[1])).toList(),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResultDownloadCard() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.download,
                color: Color(0xFFE195AB),
                size: 24,
              ),
              SizedBox(width: 10),
              Text(
                "Download Student Results",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
          SizedBox(height: 20),

          // Class dropdown
          Text(
            "Select Class:",
            style: TextStyle(fontWeight: FontWeight.w500),
          ),
          SizedBox(height: 5),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                isExpanded: true,
                value: _selectedClass,
                icon: Icon(Icons.keyboard_arrow_down, color: Color(0xFFE195AB)),
                items: _classes.map((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedClass = newValue!;
                  });
                },
              ),
            ),
          ),

          SizedBox(height: 15),

          // Student dropdown
          Text(
            "Select Student:",
            style: TextStyle(fontWeight: FontWeight.w500),
          ),
          SizedBox(height: 5),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                isExpanded: true,
                value: _selectedStudent,
                icon: Icon(Icons.keyboard_arrow_down, color: Color(0xFFE195AB)),
                items: _students.map((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedStudent = newValue!;
                  });
                },
              ),
            ),
          ),

          SizedBox(height: 20),

          // Download button
          Center(
            child: ElevatedButton.icon(
              onPressed: _downloadResults,
              icon: Icon(Icons.download),
              label: Text("Download Results"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFFE195AB),
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return "N/A";
    try {
      final date = DateTime.parse(dateStr);
      return "${date.day}/${date.month}/${date.year}";
    } catch (e) {
      return dateStr;
    }
  }
}
