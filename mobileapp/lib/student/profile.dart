import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';

import '../components/header.dart';
import '../components/footer.dart';

class Profile extends StatefulWidget {
  final String studentId;

  const Profile({Key? key, required this.studentId}) : super(key: key);

  @override
  State<Profile> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<Profile> {
  int _selectedIndex = 4; // Profile tab selected
  Map<String, dynamic>? _studentData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadStudentData();
  }

  void _loadStudentData() async {
    try {
      final String response =
          await rootBundle.loadString('lib/data/students.json');
      final data = await json.decode(response);

      setState(() {
        _studentData = data.firstWhere(
            (student) => student['studentId'] == widget.studentId,
            orElse: () => null);
        _isLoading = false;
        print('Loaded student data: $_studentData'); // Debug print statement
      });
    } catch (e) {
      print('Error loading student data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    // Navigate to different pages based on index
    switch (index) {
      case 0:
        Navigator.pushReplacementNamed(context, '/student');
        break;
      case 1:
        Navigator.pushReplacementNamed(context, '/student/assignments');
        break;
      case 2:
        Navigator.pushReplacementNamed(context, '/student/community');
        break;
      case 3:
        Navigator.pushReplacementNamed(context, '/student/aibot');
        break;
      case 4:
        // Already on profile page
        break;
    }
  }

  void _downloadResults() {
    // Show a loading indicator
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Row(
          children: [
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            SizedBox(width: 16),
            Text('Downloading your results...'),
          ],
        ),
        duration: Duration(seconds: 2),
      ),
    );

    // Simulate download completion after a delay
    Future.delayed(const Duration(seconds: 2), () {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Results downloaded successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF49ABB0),
      body: _isLoading || _studentData == null
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          : SingleChildScrollView(
              child: Column(
                children: [
                  // Header
                  Header(
                    onProfileTap: () {},
                    onNotificationTap: () {
                      Navigator.pushNamed(context, '/notifications');
                    },
                    profileImage:
                        _studentData!['image'] ?? 'lib/images/image3.png',
                    welcomeText: "STUDENT PROFILE",
                  ),
                  const SizedBox(height: 20),

                  // Profile content
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.fromLTRB(0, 30, 0, 0),
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                    decoration: const BoxDecoration(
                      color: Color.fromARGB(255, 245, 245, 221),
                      borderRadius: BorderRadius.vertical(
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
                                color: const Color(0xFF49ABB0),
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
                              backgroundImage:
                                  AssetImage(_studentData!['image']),
                              onBackgroundImageError: (e, _) {
                                debugPrint('Image error: $e');
                              },
                            ),
                          ),
                        ),

                        // Name and ID
                        Transform.translate(
                          offset: const Offset(0, -30),
                          child: Column(
                            children: [
                              Text(
                                _studentData!['name'],
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text(
                                "ID: ${_studentData!['studentId']}",
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
                                      const Color(0xFF49ABB0).withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  _studentData!['grade'],
                                  style: const TextStyle(
                                    color: Color(0xFF49ABB0),
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
                              _buildStatColumn(
                                  "Assignments",
                                  _studentData!
                                          .containsKey('completedAssignments')
                                      ? "${_studentData!['completedAssignments']}"
                                      : "0"),
                              _buildDivider(),
                              _buildStatColumn(
                                  "Average",
                                  _studentData!.containsKey('averageScore')
                                      ? "${_studentData!['averageScore']}%"
                                      : "N/A"),
                              _buildDivider(),
                              _buildStatColumn(
                                  "Attendance",
                                  _studentData!.containsKey('attendance')
                                      ? "${_studentData!['attendance']}%"
                                      : "N/A"),
                            ],
                          ),
                        ),

                        // Personal Information Card
                        _buildInfoCard(),

                        // Badges Card
                        _buildBadgesCard(),

                        // Download Results button
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 20.0),
                          child: ElevatedButton.icon(
                            onPressed: _downloadResults,
                            icon:
                                const Icon(Icons.download, color: Colors.white),
                            label: const Text(
                              "DOWNLOAD RESULTS",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Colors.white,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF49ABB0),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 30,
                                vertical: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30),
                              ),
                              elevation: 5,
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

  Widget _buildInfoCard() {
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
          const Row(
            children: [
              Icon(
                Icons.person,
                color: Color(0xFF49ABB0),
                size: 24,
              ),
              SizedBox(width: 10),
              Text(
                "Personal Information",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
          const SizedBox(height: 15),
          _buildInfoRow("Name", _studentData!['name']),
          _buildInfoRow("Email", _studentData!['email']),
          _buildInfoRow("Address", _studentData!['address']),
          _buildInfoRow(
              "Date of Birth",
              DateFormat('dd-MM-yyyy')
                  .format(DateTime.parse(_studentData!['dob']))),
          _buildInfoRow("Guardian", _studentData!['guardianName']),
          _buildInfoRow("Class", _studentData!['grade']),
          if (_studentData!.containsKey('phoneNumber'))
            _buildInfoRow("Phone", _studentData!['phoneNumber']),
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
            width: 100,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadgesCard() {
    if (!_studentData!.containsKey('badges') ||
        (_studentData!['badges'] as List).isEmpty) {
      return const SizedBox.shrink();
    }

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
          const Row(
            children: [
              Icon(
                Icons.emoji_events,
                color: Color(0xFF49ABB0),
                size: 24,
              ),
              SizedBox(width: 10),
              Text(
                "Achievements & Badges",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
          const SizedBox(height: 15),
          Wrap(
            spacing: 8.0,
            runSpacing: 8.0,
            children: (_studentData!['badges'] as List).map<Widget>((badge) {
              return Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF49ABB0).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: const Color(0xFF49ABB0),
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.star,
                      color: Color(0xFF49ABB0),
                      size: 16,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      badge.toString(),
                      style: const TextStyle(
                        color: Color(0xFF49ABB0),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
