import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';
import '../components/teacherheader.dart';
import 'facassignmentdetail.dart';

class FacClassroomDetail extends StatefulWidget {
  final String classroomId;
  final dynamic classroom;

  FacClassroomDetail({
    required this.classroomId,
    required this.classroom,
  });

  @override
  _FacClassroomDetailState createState() => _FacClassroomDetailState();
}

class _FacClassroomDetailState extends State<FacClassroomDetail>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = true;
  List<dynamic> _assignments = [];
  List<dynamic> _students = [];
  List<dynamic> _announcements = [];
  String _activeTab = 'assignments';

  // Theme colors
  final Color teacherPrimaryColor = const Color(0xFFE195AB);
  final Color backgroundColor = const Color(0xFFF5F5DD);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = const Color(0xFF49ABB0);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadClassroomData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadClassroomData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Load assignments data
      final String assignmentsResponse =
          await rootBundle.loadString('lib/data/assignments.json');
      final assignmentsData = json.decode(assignmentsResponse);

      // Filter to only show assignments for this classroom
      final filteredAssignments = assignmentsData
          .where(
              (assignment) => assignment['classroomId'] == widget.classroomId)
          .toList();

      // Load students data
      final String studentsResponse =
          await rootBundle.loadString('lib/data/students.json');
      final studentsData = json.decode(studentsResponse);

      // Filter to only show students enrolled in this classroom
      final filteredStudents = studentsData
          .where((student) =>
              student['enrolledClassrooms'] != null &&
              student['enrolledClassrooms'].contains(widget.classroomId))
          .toList();

      // Load announcements data
      final String announcementsResponse =
          await rootBundle.loadString('lib/data/announcements.json');
      final announcementsData = json.decode(announcementsResponse);

      // Filter to only show announcements for this classroom
      final filteredAnnouncements = announcementsData
          .where((announcement) =>
              announcement['classroomId'] == widget.classroomId)
          .toList();

      setState(() {
        _assignments = filteredAssignments;
        _students = filteredStudents;
        _announcements = filteredAnnouncements;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading classroom data: $e');
      setState(() {
        // Set mock data if JSON loading fails
        _assignments = _getMockAssignments();
        _students = _getMockStudents();
        _announcements = _getMockAnnouncements();
        _isLoading = false;
      });
    }
  }

  List<dynamic> _getMockAssignments() {
    return [
      {
        "_id": "assignment001",
        "title": "Algebra Quiz #3",
        "description": "Review of quadratic equations and polynomial functions",
        "dueDate": "2025-05-15T23:59:59Z",
        "pointsPossible": 50,
        "type": "Quiz",
        "status": "Active",
        "createdAt": "2025-05-01T09:30:00Z",
        "submissionsCount": 18,
        "averageScore": 42
      },
      {
        "_id": "assignment002",
        "title": "Linear Algebra Problem Set",
        "description":
            "Practice problems on matrices, determinants, and vector spaces",
        "dueDate": "2025-05-20T23:59:59Z",
        "pointsPossible": 100,
        "type": "Homework",
        "status": "Active",
        "createdAt": "2025-05-03T14:15:00Z",
        "submissionsCount": 12,
        "averageScore": 78
      }
    ];
  }

  List<dynamic> _getMockStudents() {
    return [
      {
        "_id": "student001",
        "name": "Arjun Sharma",
        "email": "arjun.sharma@example.com",
        "profileImage": "https://randomuser.me/api/portraits/men/32.jpg",
        "overallGrade": 92
      },
      {
        "_id": "student002",
        "name": "Priya Mehta",
        "email": "priya.mehta@example.com",
        "profileImage": "https://randomuser.me/api/portraits/women/44.jpg",
        "overallGrade": 88
      }
    ];
  }

  List<dynamic> _getMockAnnouncements() {
    return [
      {
        "_id": "announcement001",
        "title": "Final Exam Date Changed",
        "content":
            "The final exam has been rescheduled to May 28th at 2:00 PM. Please adjust your study plans accordingly.",
        "createdAt": "2025-05-02T10:30:00Z",
        "viewCount": 24
      },
      {
        "_id": "announcement002",
        "title": "Office Hours Extended",
        "content":
            "I've extended my office hours this week to help with exam preparation. Available Tuesday and Thursday from 3-5 PM.",
        "createdAt": "2025-05-03T16:45:00Z",
        "viewCount": 18
      }
    ];
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return DateFormat.yMMMd().format(date);
    } catch (e) {
      return dateString;
    }
  }

  String _formatDueDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      final now = DateTime.now();
      final difference = date.difference(now);

      if (difference.inDays < 0) {
        return "Overdue";
      } else if (difference.inDays == 0) {
        return "Due today";
      } else if (difference.inDays == 1) {
        return "Due tomorrow";
      } else {
        return "Due in ${difference.inDays} days";
      }
    } catch (e) {
      return dateString;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Get the subject color
    final subjectColor = _getSubjectColor(widget.classroom['subject'] ?? '');

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: subjectColor,
        elevation: 0,
        title: Text(
          widget.classroom['name'] ?? 'Classroom',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {
              // Navigate to classroom settings
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("Classroom settings coming soon")),
              );
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Classroom header
                Container(
                  color: subjectColor,
                  padding: EdgeInsets.only(left: 16, right: 16, bottom: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            widget.classroom['code'] ?? '',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(width: 8),
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              widget.classroom['gradeLevel'] ?? '',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      Text(
                        widget.classroom['description'] ?? '',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.9),
                          fontSize: 14,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),

                // Tabs for navigation
                Container(
                  color: subjectColor,
                  child: TabBar(
                    controller: _tabController,
                    indicatorColor: Colors.white,
                    indicatorWeight: 3,
                    tabs: [
                      Tab(text: "ASSIGNMENTS"),
                      Tab(text: "STUDENTS"),
                      Tab(text: "ANNOUNCEMENTS"),
                    ],
                    onTap: (index) {
                      setState(() {
                        _activeTab = index == 0
                            ? 'assignments'
                            : (index == 1 ? 'students' : 'announcements');
                      });
                    },
                  ),
                ),

                // Content area
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      // Assignments tab
                      _buildAssignmentsTab(),

                      // Students tab
                      _buildStudentsTab(),

                      // Announcements tab
                      _buildAnnouncementsTab(),
                    ],
                  ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (_activeTab == 'assignments') {
            _showCreateAssignmentDialog();
          } else if (_activeTab == 'students') {
            _showAddStudentDialog();
          } else {
            _showCreateAnnouncementDialog();
          }
        },
        backgroundColor: accentColor,
        child: Icon(_getFloatingActionButtonIcon()),
      ),
    );
  }

  IconData _getFloatingActionButtonIcon() {
    switch (_activeTab) {
      case 'assignments':
        return Icons.assignment_add;
      case 'students':
        return Icons.person_add;
      case 'announcements':
        return Icons.campaign;
      default:
        return Icons.add;
    }
  }

  Widget _buildAssignmentsTab() {
    if (_assignments.isEmpty) {
      return _buildEmptyState(
        icon: Icons.assignment,
        title: "No assignments",
        subtitle: "Create your first assignment",
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: _assignments.length,
      itemBuilder: (context, index) {
        final assignment = _assignments[index];
        return _buildAssignmentCard(assignment);
      },
    );
  }

  Widget _buildAssignmentCard(dynamic assignment) {
    final String title = assignment['title'] ?? 'Untitled Assignment';
    final String description = assignment['description'] ?? '';
    final String dueDate = assignment['dueDate'] ?? '';
    final int pointsPossible = assignment['pointsPossible'] ?? 0;
    final String type = assignment['type'] ?? 'Assignment';
    final String status = assignment['status'] ?? 'Active';
    final int submissionsCount = assignment['submissionsCount'] ?? 0;
    final int averageScore = assignment['averageScore'] ?? 0;

    // Determine the status color
    Color statusColor = Colors.blue;
    if (status.toLowerCase() == 'active') {
      statusColor = Colors.green;
    } else if (status.toLowerCase() == 'draft') {
      statusColor = Colors.grey;
    } else if (status.toLowerCase() == 'closed') {
      statusColor = Colors.red;
    }

    // Determine the type icon
    IconData typeIcon = Icons.assignment;
    if (type.toLowerCase() == 'quiz') {
      typeIcon = Icons.quiz;
    } else if (type.toLowerCase() == 'exam') {
      typeIcon = Icons.timer;
    } else if (type.toLowerCase() == 'project') {
      typeIcon = Icons.build;
    } else if (type.toLowerCase() == 'homework') {
      typeIcon = Icons.home;
    }

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => FacAssignmentDetail(
                assignmentId: assignment['_id'],
                assignment: assignment,
                classroomId: widget.classroomId,
                classroomName: widget.classroom['name'] ?? 'Classroom',
                classroomColor:
                    _getSubjectColor(widget.classroom['subject'] ?? ''),
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with type and status
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Type badge
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(typeIcon, size: 16, color: Colors.grey[700]),
                        SizedBox(width: 4),
                        Text(
                          type,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey[700],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Status badge
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.circle, size: 8, color: statusColor),
                        SizedBox(width: 4),
                        Text(
                          status,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: statusColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              title,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                            SizedBox(height: 8),
                            Text(
                              description,
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: accentColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              "$pointsPossible pts",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: accentColor,
                              ),
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            dueDate.isNotEmpty
                                ? _formatDueDate(dueDate)
                                : "No due date",
                            style: TextStyle(
                              fontSize: 12,
                              color: _isDueDateUrgent(dueDate)
                                  ? Colors.red
                                  : Colors.grey[600],
                              fontWeight: _isDueDateUrgent(dueDate)
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  // Stats
                  SizedBox(height: 16),
                  Divider(),
                  SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.people, size: 16, color: Colors.grey[600]),
                          SizedBox(width: 4),
                          Text(
                            "$submissionsCount submissions",
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Icon(Icons.analytics,
                              size: 16, color: Colors.grey[600]),
                          SizedBox(width: 4),
                          Text(
                            "Avg: $averageScore%",
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      TextButton(
                        onPressed: () {
                          // Navigate to grade assignment
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text("Grade assignment")),
                          );
                        },
                        child: Text("Grade"),
                        style: TextButton.styleFrom(
                          foregroundColor: accentColor,
                          padding: EdgeInsets.zero,
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

  bool _isDueDateUrgent(String dueDate) {
    if (dueDate.isEmpty) return false;

    try {
      final date = DateTime.parse(dueDate);
      final now = DateTime.now();
      final difference = date.difference(now);

      // Return true if due date is today or overdue
      return difference.inDays <= 0;
    } catch (e) {
      return false;
    }
  }

  Widget _buildStudentsTab() {
    if (_students.isEmpty) {
      return _buildEmptyState(
        icon: Icons.people,
        title: "No students enrolled",
        subtitle: "Add students to this classroom",
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: _students.length,
      itemBuilder: (context, index) {
        final student = _students[index];
        return _buildStudentCard(student);
      },
    );
  }

  Widget _buildStudentCard(dynamic student) {
    final String name = student['name'] ?? 'Unknown Student';
    final String email = student['email'] ?? '';
    final String profileImage = student['profileImage'] ?? '';
    final int overallGrade = student['overallGrade'] ?? 0;

    return Card(
      margin: EdgeInsets.only(bottom: 12),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: ListTile(
        contentPadding: EdgeInsets.all(12),
        leading: CircleAvatar(
          backgroundImage:
              profileImage.isNotEmpty ? NetworkImage(profileImage) : null,
          backgroundColor: profileImage.isEmpty ? Colors.grey.shade300 : null,
          child: profileImage.isEmpty
              ? Text(
                  name.isNotEmpty ? name[0].toUpperCase() : '?',
                  style: TextStyle(color: Colors.grey.shade700),
                )
              : null,
        ),
        title: Text(
          name,
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(email),
        trailing: Container(
          padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: _getGradeColor(overallGrade).withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            "$overallGrade%",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: _getGradeColor(overallGrade),
            ),
          ),
        ),
        onTap: () {
          // Navigate to student detail
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("View student details")),
          );
        },
      ),
    );
  }

  Color _getGradeColor(int grade) {
    if (grade >= 90) return Colors.green;
    if (grade >= 80) return Colors.lightGreen;
    if (grade >= 70) return Colors.amber;
    if (grade >= 60) return Colors.orange;
    return Colors.red;
  }

  Widget _buildAnnouncementsTab() {
    if (_announcements.isEmpty) {
      return _buildEmptyState(
        icon: Icons.campaign,
        title: "No announcements",
        subtitle: "Create your first announcement",
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: _announcements.length,
      itemBuilder: (context, index) {
        final announcement = _announcements[index];
        return _buildAnnouncementCard(announcement);
      },
    );
  }

  Widget _buildAnnouncementCard(dynamic announcement) {
    final String title = announcement['title'] ?? 'Untitled Announcement';
    final String content = announcement['content'] ?? '';
    final String createdAt = announcement['createdAt'] ?? '';
    final int viewCount = announcement['viewCount'] ?? 0;

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.campaign, color: accentColor),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            Text(
              content,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[700],
              ),
            ),
            SizedBox(height: 16),
            Divider(),
            SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  createdAt.isNotEmpty ? _formatDate(createdAt) : "No date",
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
                Row(
                  children: [
                    Icon(Icons.visibility, size: 14, color: Colors.grey[500]),
                    SizedBox(width: 4),
                    Text(
                      "$viewCount views",
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 64,
            color: Colors.grey[400],
          ),
          SizedBox(height: 16),
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[700],
            ),
          ),
          SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  void _showCreateAssignmentDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Create Assignment",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 24),
            // Assignment type options
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildAssignmentTypeOption(Icons.assignment, "Assignment"),
                _buildAssignmentTypeOption(Icons.quiz, "Quiz"),
                _buildAssignmentTypeOption(Icons.timer, "Exam"),
                _buildAssignmentTypeOption(Icons.build, "Project"),
              ],
            ),
            SizedBox(height: 24),
            // Create button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                        content: Text("Create assignment feature coming soon")),
                  );
                },
                child: Text("CREATE"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: accentColor,
                  padding: EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAssignmentTypeOption(IconData icon, String label) {
    return InkWell(
      onTap: () {
        // Select this assignment type
        Navigator.pop(context);
        // Show a message for now - this would create a new assignment of the selected type
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Creating a new $label...")),
        );
      },
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            Icon(icon, color: accentColor, size: 32),
            SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddStudentDialog() {
    showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Add Students",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "Enter student email",
                      prefixIcon: Icon(Icons.email),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 16),
                ElevatedButton(
                  onPressed: () {},
                  child: Icon(Icons.add),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: accentColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    minimumSize: Size(48, 48),
                  ),
                ),
              ],
            ),
            SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Classroom Code: ${widget.classroom['code']}",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                OutlinedButton.icon(
                  onPressed: () {
                    // Copy classroom code to clipboard
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                          content: Text("Classroom code copied to clipboard")),
                    );
                  },
                  icon: Icon(Icons.copy),
                  label: Text("Copy"),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: accentColor,
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              "Students can join the classroom using this code",
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCreateAnnouncementDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Container(
          padding: EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Create Announcement",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              TextField(
                decoration: InputDecoration(
                  hintText: "Title",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
              SizedBox(height: 16),
              TextField(
                decoration: InputDecoration(
                  hintText: "Content",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                maxLines: 4,
              ),
              SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: Text("CANCEL"),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.grey[700],
                        padding: EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                              content:
                                  Text("Announcement created successfully")),
                        );
                      },
                      child: Text("POST"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: accentColor,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
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
}
