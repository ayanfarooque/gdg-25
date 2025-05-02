import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';
import '../components/teacherheader.dart';

class FacAssignmentDetail extends StatefulWidget {
  final String assignmentId;
  final dynamic assignment;
  final String classroomId;
  final String classroomName;
  final Color classroomColor;

  FacAssignmentDetail({
    required this.assignmentId,
    required this.assignment,
    required this.classroomId,
    required this.classroomName,
    required this.classroomColor,
  });

  @override
  _FacAssignmentDetailState createState() => _FacAssignmentDetailState();
}

class _FacAssignmentDetailState extends State<FacAssignmentDetail> {
  bool _isLoading = true;
  List<dynamic> _submissions = [];
  Map<String, dynamic> _stats = {};
  
  // Theme colors
  final Color teacherPrimaryColor = const Color(0xFFE195AB);
  final Color backgroundColor = const Color(0xFFF5F5DD);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = const Color(0xFF49ABB0);

  @override
  void initState() {
    super.initState();
    _loadSubmissionsData();
  }

  Future<void> _loadSubmissionsData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Load submissions data
      final String submissionsResponse = await rootBundle.loadString('lib/data/submissions.json');
      final submissionsData = json.decode(submissionsResponse);
      
      // Filter submissions for this assignment
      final filteredSubmissions = submissionsData.where((submission) => 
        submission['assignmentId'] == widget.assignmentId).toList();

      // Load students data to get names
      final String studentsResponse = await rootBundle.loadString('lib/data/students.json');
      final studentsData = json.decode(studentsResponse);

      // Enhance submissions with student data
      for (var submission in filteredSubmissions) {
        final studentId = submission['studentId'];
        final student = studentsData.firstWhere(
          (s) => s['_id'] == studentId,
          orElse: () => {'name': 'Unknown Student', 'profileImage': ''},
        );
        
        submission['studentName'] = student['name'];
        submission['studentImage'] = student['profileImage'];
      }

      // Calculate stats
      int completed = filteredSubmissions.length;
      int totalStudents = studentsData.where((student) => 
        student['enrolledClassrooms'] != null &&
        student['enrolledClassrooms'].contains(widget.classroomId)).length;
      int pending = totalStudents - completed;
      double averageScore = 0;
      
      if (completed > 0) {
        double totalScore = 0;
        for (var submission in filteredSubmissions) {
          totalScore += submission['score'] ?? 0;
        }
        averageScore = totalScore / completed;
      }

      setState(() {
        _submissions = filteredSubmissions;
        _stats = {
          'completed': completed,
          'pending': pending,
          'total': totalStudents,
          'averageScore': averageScore,
          'maxScore': widget.assignment['pointsPossible'] ?? 100,
        };
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading submissions data: $e');
      setState(() {
        // Mock data if loading fails
        _submissions = _getMockSubmissions();
        _stats = {
          'completed': _submissions.length,
          'pending': 5,
          'total': _submissions.length + 5,
          'averageScore': 78.5,
          'maxScore': widget.assignment['pointsPossible'] ?? 100,
        };
        _isLoading = false;
      });
    }
  }

  List<dynamic> _getMockSubmissions() {
    return [
      {
        "submissionId": "sub001",
        "assignmentId": widget.assignmentId,
        "studentId": "student001",
        "studentName": "Arjun Sharma",
        "studentImage": "https://randomuser.me/api/portraits/men/32.jpg",
        "submittedDate": "2025-05-12T14:30:00Z",
        "status": "graded",
        "score": 92,
        "feedback": "Excellent work on the examples and explanations.",
        "attachments": [
          {"name": "assignment1_arjun.pdf", "size": 2400000, "type": "pdf"}
        ]
      },
      {
        "submissionId": "sub002",
        "assignmentId": widget.assignmentId,
        "studentId": "student002",
        "studentName": "Priya Mehta",
        "studentImage": "https://randomuser.me/api/portraits/women/44.jpg",
        "submittedDate": "2025-05-11T16:45:00Z",
        "status": "graded",
        "score": 85,
        "feedback": "Good work, but could improve on section 3.",
        "attachments": [
          {"name": "priya_homework.docx", "size": 1800000, "type": "document"}
        ]
      },
      {
        "submissionId": "sub003",
        "assignmentId": widget.assignmentId,
        "studentId": "student003",
        "studentName": "Raj Kumar",
        "studentImage": "https://randomuser.me/api/portraits/men/67.jpg",
        "submittedDate": "2025-05-13T10:15:00Z",
        "status": "submitted",
        "attachments": [
          {"name": "raj_assignment.pdf", "size": 3200000, "type": "pdf"}
        ]
      }
    ];
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return DateFormat.yMMMd().add_jm().format(date);
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
    final String title = widget.assignment['title'] ?? 'Untitled Assignment';
    final String description = widget.assignment['description'] ?? '';
    final String dueDate = widget.assignment['dueDate'] ?? '';
    final int pointsPossible = widget.assignment['pointsPossible'] ?? 0;
    final String type = widget.assignment['type'] ?? 'Assignment';
    final String status = widget.assignment['status'] ?? 'Active';
    
    // Determine the status color
    Color statusColor = Colors.blue;
    if (status.toLowerCase() == 'active') {
      statusColor = Colors.green;
    } else if (status.toLowerCase() == 'draft') {
      statusColor = Colors.grey;
    } else if (status.toLowerCase() == 'closed') {
      statusColor = Colors.red;
    }

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: widget.classroomColor,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 16,
              ),
            ),
            Text(
              widget.classroomName,
              style: TextStyle(
                color: Colors.white.withOpacity(0.9),
                fontSize: 12,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.more_vert),
            onPressed: () {
              _showOptionsMenu(context);
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Assignment details card
                  Container(
                    color: widget.classroomColor,
                    padding: EdgeInsets.all(16),
                    child: Card(
                      margin: EdgeInsets.zero,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 2,
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Type and status row
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: widget.classroomColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    type,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: widget.classroomColor,
                                    ),
                                  ),
                                ),
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
                            
                            SizedBox(height: 16),
                            
                            // Description
                            Text(
                              description,
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[700],
                              ),
                            ),
                            
                            SizedBox(height: 16),
                            Divider(),
                            
                            // Due date and points
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Icon(Icons.calendar_today, size: 16, color: Colors.grey[600]),
                                    SizedBox(width: 4),
                                    Text(
                                      dueDate.isNotEmpty ? _formatDueDate(dueDate) : "No due date",
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
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
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Stats cards
                  Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Assignment Statistics",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                        SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: _buildStatCard(
                                "Submitted",
                                _stats['completed'].toString(),
                                "${(_stats['completed'] / _stats['total'] * 100).round()}%",
                                Icons.assignment_turned_in,
                                Colors.green,
                              ),
                            ),
                            SizedBox(width: 16),
                            Expanded(
                              child: _buildStatCard(
                                "Pending",
                                _stats['pending'].toString(),
                                "${(_stats['pending'] / _stats['total'] * 100).round()}%",
                                Icons.pending_actions,
                                Colors.orange,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: _buildStatCard(
                                "Average Score",
                                "${_stats['averageScore'].toStringAsFixed(1)} / ${_stats['maxScore']}",
                                "${(_stats['averageScore'] / _stats['maxScore'] * 100).round()}%",
                                Icons.analytics,
                                accentColor,
                              ),
                            ),
                            SizedBox(width: 16),
                            Expanded(
                              child: _buildStatCard(
                                "Total Students",
                                _stats['total'].toString(),
                                "100%",
                                Icons.people,
                                widget.classroomColor,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Action buttons
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              _showExtendDialog();
                            },
                            icon: Icon(Icons.date_range),
                            label: Text("Extend"),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: widget.classroomColor,
                              side: BorderSide(color: widget.classroomColor),
                              padding: EdgeInsets.symmetric(vertical: 12),
                            ),
                          ),
                        ),
                        SizedBox(width: 16),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              // Batch grading
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text("Batch grading coming soon")),
                              );
                            },
                            icon: Icon(Icons.grade),
                            label: Text("Grade All"),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: accentColor,
                              foregroundColor: Colors.white,
                              padding: EdgeInsets.symmetric(vertical: 12),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Student submissions
                  Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Student Submissions",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                        SizedBox(height: 16),
                        ListView.builder(
                          shrinkWrap: true,
                          physics: NeverScrollableScrollPhysics(),
                          itemCount: _submissions.length,
                          itemBuilder: (context, index) {
                            return _buildSubmissionCard(_submissions[index]);
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard(String title, String value, String percentage, IconData icon, Color color) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 20),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    percentage,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmissionCard(dynamic submission) {
    final String studentName = submission['studentName'] ?? 'Unknown Student';
    final String studentImage = submission['studentImage'] ?? '';
    final String submittedDate = submission['submittedDate'] ?? '';
    final String status = submission['status'] ?? 'submitted';
    final int? score = submission['score'];
    final String feedback = submission['feedback'] ?? '';
    final List<dynamic> attachments = submission['attachments'] ?? [];

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: () {
          // Navigate to detailed submission view
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("View submission details")),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Student info row
              Row(
                children: [
                  CircleAvatar(
                    backgroundImage: studentImage.isNotEmpty ? NetworkImage(studentImage) : null,
                    backgroundColor: studentImage.isEmpty ? Colors.grey.shade300 : null,
                    child: studentImage.isEmpty
                        ? Text(
                            studentName.isNotEmpty ? studentName[0].toUpperCase() : '?',
                            style: TextStyle(color: Colors.grey.shade700),
                          )
                        : null,
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          studentName,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          submittedDate.isNotEmpty ? _formatDate(submittedDate) : "No submission date",
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  _buildStatusBadge(status, score),
                ],
              ),
              
              // Attachments if any
              if (attachments.isNotEmpty) ...[
                SizedBox(height: 16),
                Text(
                  "Attachments",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[700],
                  ),
                ),
                SizedBox(height: 8),
                ...attachments.map((attachment) => _buildAttachmentItem(attachment)).toList(),
              ],

              // Feedback if any
              if (feedback.isNotEmpty) ...[
                SizedBox(height: 16),
                Divider(),
                SizedBox(height: 8),
                Text(
                  "Feedback",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[700],
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  feedback,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
              
              // Action buttons
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (status.toLowerCase() != 'graded')
                    OutlinedButton(
                      onPressed: () {
                        // Grade submission
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("Grade submission")),
                        );
                      },
                      child: Text("Grade"),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: accentColor,
                      ),
                    ),
                  SizedBox(width: 8),
                  ElevatedButton.icon(
                    onPressed: () {
                      // View submission
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("View submission")),
                      );
                    },
                    icon: Icon(Icons.visibility, size: 16),
                    label: Text("View"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: widget.classroomColor,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                      minimumSize: Size(0, 36),
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

  Widget _buildStatusBadge(String status, int? score) {
    Color bgColor;
    Color textColor;
    String text;
    IconData icon;

    switch (status.toLowerCase()) {
      case 'graded':
        bgColor = Colors.green;
        textColor = Colors.white;
        text = score != null ? "$score pts" : "Graded";
        icon = Icons.check_circle;
        break;
      case 'submitted':
        bgColor = Colors.blue;
        textColor = Colors.white;
        text = "Submitted";
        icon = Icons.assignment_turned_in;
        break;
      case 'late':
        bgColor = Colors.orange;
        textColor = Colors.white;
        text = "Late";
        icon = Icons.warning;
        break;
      case 'missing':
        bgColor = Colors.red;
        textColor = Colors.white;
        text = "Missing";
        icon = Icons.cancel;
        break;
      default:
        bgColor = Colors.grey;
        textColor = Colors.white;
        text = "Unknown";
        icon = Icons.help;
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: textColor, size: 12),
          SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              color: textColor,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAttachmentItem(dynamic attachment) {
    final String name = attachment['name'] ?? 'Unknown file';
    final int size = attachment['size'] ?? 0;
    final String type = attachment['type'] ?? 'document';

    IconData iconData;
    switch (type.toLowerCase()) {
      case 'pdf':
        iconData = Icons.picture_as_pdf;
        break;
      case 'document':
        iconData = Icons.description;
        break;
      case 'image':
        iconData = Icons.image;
        break;
      case 'video':
        iconData = Icons.videocam;
        break;
      default:
        iconData = Icons.attach_file;
    }

    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(iconData, color: accentColor),
      ),
      title: Text(
        name,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
        ),
      ),
      subtitle: Text(
        _formatFileSize(size),
        style: TextStyle(
          fontSize: 12,
          color: Colors.grey[600],
        ),
      ),
      trailing: IconButton(
        icon: Icon(Icons.download, color: accentColor),
        onPressed: () {
          // Download attachment
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Downloading $name...")),
          );
        },
      ),
    );
  }

  String _formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    if (bytes < 1024 * 1024 * 1024) return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
  }

  void _showOptionsMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Icon(Icons.edit, color: accentColor),
              title: Text("Edit Assignment"),
              onTap: () {
                Navigator.pop(context);
                // Show edit dialog
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Edit assignment coming soon")),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.date_range, color: accentColor),
              title: Text("Change Due Date"),
              onTap: () {
                Navigator.pop(context);
                _showExtendDialog();
              },
            ),
            ListTile(
              leading: Icon(Icons.copy, color: accentColor),
              title: Text("Duplicate Assignment"),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Duplicate assignment coming soon")),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.delete, color: Colors.red),
              title: Text(
                "Delete Assignment",
                style: TextStyle(color: Colors.red),
              ),
              onTap: () {
                Navigator.pop(context);
                _showDeleteConfirmation();
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showExtendDialog() {
    DateTime selectedDate = DateTime.now().add(Duration(days: 7));
    TimeOfDay selectedTime = TimeOfDay(hour: 23, minute: 59);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Extend Due Date"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "Current due date: ${widget.assignment['dueDate'] != null ? _formatDate(widget.assignment['dueDate']) : 'None'}",
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
              SizedBox(height: 16),
              ListTile(
                title: Text("New due date"),
                subtitle: Text(DateFormat.yMMMd().format(selectedDate)),
                trailing: Icon(Icons.calendar_today),
                onTap: () async {
                  final DateTime? picked = await showDatePicker(
                    context: context,
                    initialDate: selectedDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(Duration(days: 365)),
                  );
                  if (picked != null && picked != selectedDate) {
                    setState(() {
                      selectedDate = picked;
                    });
                  }
                },
              ),
              ListTile(
                title: Text("Time"),
                subtitle: Text(selectedTime.format(context)),
                trailing: Icon(Icons.access_time),
                onTap: () async {
                  final TimeOfDay? picked = await showTimePicker(
                    context: context,
                    initialTime: selectedTime,
                  );
                  if (picked != null && picked != selectedTime) {
                    setState(() {
                      selectedTime = picked;
                    });
                  }
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text("CANCEL"),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Due date extended")),
                );
              },
              child: Text("EXTEND"),
              style: ElevatedButton.styleFrom(
                backgroundColor: accentColor,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        );
      },
    );
  }

  void _showDeleteConfirmation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Delete Assignment?"),
          content: Text(
            "This will permanently delete the assignment and all student submissions. This action cannot be undone.",
            style: TextStyle(
              fontSize: 14,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text("CANCEL"),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context); // Return to classroom detail page
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Assignment deleted")),
                );
              },
              child: Text("DELETE"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        );
      },
    );
  }
}