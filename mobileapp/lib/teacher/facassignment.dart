import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import '../components/teacherheader.dart';
import '../components/footer.dart';
import 'FacClassroomDetail.dart';

class FacClassroomsLanding extends StatefulWidget {
  @override
  State<FacClassroomsLanding> createState() => _FacClassroomsLandingState();
}

class _FacClassroomsLandingState extends State<FacClassroomsLanding> {
  int _selectedIndex = 1; // Set to classroom tab
  List<dynamic> _classrooms = [];
  bool _isLoading = true;

  // Theme colors
  final Color teacherPrimaryColor = const Color(0xFFE195AB);
  final Color backgroundColor = const Color(0xFFF5F5DD);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = const Color(0xFF49ABB0);

  @override
  void initState() {
    super.initState();
    _loadClassroomsData();
  }

  Future<void> _loadClassroomsData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final String response =
          await rootBundle.loadString('lib/data/classroom.json');
      final data = await json.decode(response);
      setState(() {
        _classrooms = data;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading classrooms data: $e');
      setState(() {
        // Mock data if JSON loading fails
        _classrooms = [
          {
            "_id": "mock001",
            "name": "Advanced Mathematics",
            "code": "MATH123",
            "description":
                "This course covers advanced concepts in calculus, linear algebra, and differential equations.",
            "subject": "Math",
            "gradeLevel": "College",
            "performanceStats": {
              "averageScore": 86,
              "assignmentsCompleted": 15,
              "assignmentsPending": 3
            },
            "coverImage": {
              "url": "https://example.com/images/math-classroom-cover.jpg"
            }
          },
          {
            "_id": "mock002",
            "name": "Introduction to Biology",
            "code": "BIO101",
            "description":
                "Fundamental principles of biology including cell structure, genetics, evolution, and ecology.",
            "subject": "Science",
            "gradeLevel": "High School",
            "performanceStats": {
              "averageScore": 78,
              "assignmentsCompleted": 8,
              "assignmentsPending": 2
            },
            "coverImage": {
              "url": "https://example.com/images/biology-classroom-cover.jpg"
            }
          }
        ];
        _isLoading = false;
      });
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    switch (index) {
      case 0:
        Navigator.pushReplacementNamed(context, '/teacherhome');
        break;
      case 1:
        Navigator.pushReplacementNamed(context, '/teacherclassrooms');
        break;
      case 2:
        Navigator.pushReplacementNamed(context, '/teachercommunity');
        break;
      case 3:
        Navigator.pushNamed(context, '/teacherai');
        break;
      case 4:
        Navigator.pushNamed(context, '/teacherresources');
        break;
    }
  }

  Color _getSubjectColor(String subject) {
    switch (subject.toLowerCase()) {
      case 'math':
        return Colors.blue;
      case 'science':
        return Colors.green;
      case 'history':
        return Colors.orange;
      case 'english':
        return Colors.purple;
      case 'computer science':
        return Colors.teal;
      default:
        return Colors.indigo;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: teacherPrimaryColor,
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: Colors.white))
          : SafeArea(
              child: Column(
                children: [
                  // Header section
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: TeacherHeader(
                      onProfileTap: () {
                        Navigator.pushNamed(context, '/teacherprofile');
                      },
                      onNotificationTap: () {
                        Navigator.pushNamed(context, '/teachernotifications');
                      },
                      profileImage: 'lib/images/teacher.png',
                      welcomeText: "WELCOME SENSEI",
                    ),
                  ),

                  // Main content
                  Expanded(
                    child: ClipRRect(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                      child: Container(
                        color: backgroundColor,
                        child: Column(
                          children: [
                            // Title and Create Class button
                            Padding(
                              padding:
                                  const EdgeInsets.fromLTRB(20, 24, 20, 16),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    "MY CLASSROOMS",
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: textColor,
                                    ),
                                  ),
                                  ElevatedButton.icon(
                                    onPressed: () {
                                      // Navigate to create classroom page
                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(
                                        SnackBar(
                                            content: Text(
                                                "Create classroom feature coming soon!")),
                                      );
                                    },
                                    icon: Icon(Icons.add),
                                    label: Text("CREATE"),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: accentColor,
                                      foregroundColor: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Classroom grid
                            Expanded(
                              child: _classrooms.isEmpty
                                  ? _buildEmptyState()
                                  : GridView.builder(
                                      padding: const EdgeInsets.all(16),
                                      gridDelegate:
                                          SliverGridDelegateWithFixedCrossAxisCount(
                                        crossAxisCount: 2,
                                        crossAxisSpacing: 16,
                                        mainAxisSpacing: 16,
                                        childAspectRatio: 0.8,
                                      ),
                                      itemCount: _classrooms.length,
                                      itemBuilder: (context, index) {
                                        return _buildClassroomCard(
                                            _classrooms[index]);
                                      },
                                    ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to create classroom page
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Create classroom feature coming soon!")),
          );
        },
        backgroundColor: accentColor,
        child: Icon(Icons.add),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.class_,
            size: 80,
            color: Colors.grey[400],
          ),
          SizedBox(height: 16),
          Text(
            "No classrooms found",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[700],
            ),
          ),
          SizedBox(height: 8),
          Text(
            "Create your first classroom",
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
          SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              // Navigate to create classroom page
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                    content: Text("Create classroom feature coming soon!")),
              );
            },
            icon: Icon(Icons.add),
            label: Text("CREATE CLASSROOM"),
            style: ElevatedButton.styleFrom(
              backgroundColor: accentColor,
              foregroundColor: Colors.white,
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildClassroomCard(dynamic classroom) {
    final subjectColor = _getSubjectColor(classroom['subject'] ?? '');
    final String classroomName = classroom['name'] ?? 'Untitled Classroom';
    final String classroomCode = classroom['code'] ?? '';
    final String subject = classroom['subject'] ?? '';
    final String gradeLevel = classroom['gradeLevel'] ?? '';

    // Get performance stats with fallbacks
    final Map<String, dynamic> stats = classroom['performanceStats'] ?? {};
    final int averageScore = stats['averageScore'] ?? 0;
    final int assignmentsCompleted = stats['assignmentsCompleted'] ?? 0;
    final int assignmentsPending = stats['assignmentsPending'] ?? 0;

    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => FacClassroomDetail(
                classroomId: classroom['_id'],
                classroom: classroom,
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with subject color
            Container(
              height: 8,
              decoration: BoxDecoration(
                color: subjectColor,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
            ),

            // Classroom cover image
            Container(
              height: 80,
              decoration: BoxDecoration(
                color: subjectColor.withOpacity(0.2),
                image: classroom['coverImage'] != null &&
                        classroom['coverImage']['url'] != null
                    ? DecorationImage(
                        image: NetworkImage(classroom['coverImage']['url']),
                        fit: BoxFit.cover,
                        onError: (error, stackTrace) {},
                      )
                    : null,
              ),
              child: Align(
                alignment: Alignment.topRight,
                child: Container(
                  margin: EdgeInsets.all(8),
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    classroomCode,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),

            // Classroom name and info
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    classroomName,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4),
                  Text(
                    "$subject · $gradeLevel",
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),

                  // Assignment stats
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.assignment, size: 14, color: Colors.grey[600]),
                      SizedBox(width: 4),
                      Text(
                        "$assignmentsCompleted completed",
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.pending_actions,
                          size: 14, color: Colors.grey[600]),
                      SizedBox(width: 4),
                      Text(
                        "$assignmentsPending pending",
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),

                  // Performance bar
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: Stack(
                          children: [
                            Container(
                              height: 4,
                              decoration: BoxDecoration(
                                color: Colors.grey[300],
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                            FractionallySizedBox(
                              widthFactor: averageScore / 100,
                              child: Container(
                                height: 4,
                                decoration: BoxDecoration(
                                  color: averageScore > 80
                                      ? Colors.green
                                      : (averageScore > 60
                                          ? Colors.orange
                                          : Colors.red),
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(width: 8),
                      Text(
                        "$averageScore%",
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: averageScore > 80
                              ? Colors.green
                              : (averageScore > 60
                                  ? Colors.orange
                                  : Colors.red),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
