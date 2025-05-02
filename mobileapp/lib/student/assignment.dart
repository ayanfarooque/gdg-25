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
  bool _isLoading = true;
  Map<String, dynamic>? _selectedAssignmentDetails;

  // Theme colors
  final Color primaryColor = const Color.fromARGB(255, 73, 171, 176);
  final Color backgroundColor = const Color.fromARGB(255, 236, 231, 202);
  final Color cardColor = Colors.white;
  final Color accentColor = Color(0xFF3A7CA5);
  final Color textColor = Colors.black87;

  @override
  void initState() {
    super.initState();
    _loadAssignments();
  }

  Future<void> _loadAssignments() async {
    setState(() {
      _isLoading = true;
    });

    try {
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
                  'score': assignment['score'] ?? '',
                  'feedback': assignment['feedback'] ?? '',
                })
            .toList();

        _isLoading = false;
      });
    } catch (e) {
      print('Error loading assignments: $e');
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

  Future<void> _selectFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
    );

    if (result != null) {
      setState(() {
        _selectedFileName = result.files.single.name;
      });

      // Show success snackbar
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('File selected: ${result.files.single.name}'),
          backgroundColor: Colors.green[700],
          behavior: SnackBarBehavior.floating,
          margin: EdgeInsets.all(16),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    }
  }

  void _toggleSidebar() {
    setState(() {
      _isSidebarVisible = !_isSidebarVisible;
    });
  }

  void _submitAssignment() {
    if (_selectedAssignment == null) {
      _showErrorSnackbar('Please select an assignment');
      return;
    }

    if (_selectedFileName == null) {
      _showErrorSnackbar('Please select a file to submit');
      return;
    }

    // Show loading indicator
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return Center(
          child: Container(
            width: 200,
            height: 200,
            padding: EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(color: primaryColor),
                SizedBox(height: 24),
                Text(
                  'Submitting assignment...',
                  style: TextStyle(fontSize: 16),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      },
    );

    // Simulate network delay
    Future.delayed(Duration(seconds: 2), () {
      // Close loading dialog
      Navigator.pop(context);

      // Update the assignment state
      final assignmentToUpdate = _pendingAssignments.firstWhere(
        (assignment) => assignment['title'] == _selectedAssignment,
        orElse: () => <String, dynamic>{},
      );

      if (assignmentToUpdate.isNotEmpty) {
        setState(() {
          assignmentToUpdate['isCompleted'] = true;
          assignmentToUpdate['updatedAt'] = DateTime.now().toIso8601String();

          _submittedAssignments.add(assignmentToUpdate);
          _pendingAssignments.removeWhere(
              (assignment) => assignment['title'] == _selectedAssignment);

          _selectedAssignment = null;
          _selectedFileName = null;
        });

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle_outline, color: Colors.white),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('Assignment submitted successfully!'),
                      Text(
                        'File: $_selectedFileName',
                        style: TextStyle(fontSize: 12, color: Colors.white70),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            backgroundColor: Colors.green[700],
            behavior: SnackBarBehavior.floating,
            margin: EdgeInsets.all(16),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            duration: Duration(seconds: 4),
          ),
        );
      }
    });
  }

  void _showErrorSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.error_outline, color: Colors.white),
            SizedBox(width: 12),
            Text(message),
          ],
        ),
        backgroundColor: Colors.red[700],
        behavior: SnackBarBehavior.floating,
        margin: EdgeInsets.all(16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _selectAssignment(Map<String, dynamic> assignment) {
    setState(() {
      _selectedAssignment = assignment['title'];
      _selectedAssignmentDetails = assignment;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: primaryColor,
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
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: backgroundColor,
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(30),
                              topRight: Radius.circular(30),
                            ),
                          ),
                          child: SingleChildScrollView(
                            padding: EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Page title and menu button
                                Row(
                                  children: [
                                    IconButton(
                                      icon: Icon(Icons.menu_rounded),
                                      onPressed: _toggleSidebar,
                                      color: primaryColor,
                                      iconSize: 28,
                                    ),
                                    SizedBox(width: 8),
                                    Text(
                                      "Assignment Dashboard",
                                      style: TextStyle(
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                        color: textColor,
                                      ),
                                    ),
                                    Spacer(),
                                  ],
                                ),
                                Container(
                                  decoration: BoxDecoration(
                                    color: primaryColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 6),
                                  child: Row(
                                    children: [
                                      Icon(Icons.assignment_outlined,
                                          size: 18, color: primaryColor),
                                      SizedBox(width: 6),
                                      Text(
                                        "${_pendingAssignments.length} pending",
                                        style: TextStyle(
                                          color: primaryColor,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                SizedBox(height: 24),

                                // Main content grid
                                GridLayout(
                                  children: [
                                    // Assignment Assistant Card
                                    _buildAssignmentAssistantCard(),

                                    // Pending Assignments Card
                                    _buildPendingAssignmentsCard(),

                                    // Assignment Review Card
                                    _buildAssignmentReviewCard(),

                                    // Submitted Assignments Card
                                    _buildSubmittedAssignmentsCard(),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Sidebar
                  if (_isSidebarVisible)
                    Positioned(
                      top: 0,
                      left: 0,
                      bottom: 0,
                      child: AssignmentSidebar(
                        pendingAssignments:
                            _pendingAssignments.map((assignment) {
                          return {
                            'date': DateFormat('dd MMM')
                                .format(DateTime.parse(assignment['dueDate'])),
                            'subjectCode': assignment['title'].toString(),
                            'assignmentId': assignment['id'].toString()
                          };
                        }).toList(),
                        submittedAssignments:
                            _submittedAssignments.map((assignment) {
                          return {
                            'date': DateFormat('dd MMM').format(
                                DateTime.parse(assignment['updatedAt'])),
                            'subjectCode': assignment['title'].toString(),
                            'assignmentId': assignment['id'].toString()
                          };
                        }).toList(),
                        onClose: _toggleSidebar,
                      ),
                    ),
                ],
              ),
            ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildAssignmentAssistantCard() {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: accentColor,
          width: 1,
        ),
      ),
      child: Container(
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border(
            left: BorderSide(
              color: accentColor,
              width: 5,
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Card header
            Row(
              children: [
                Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: accentColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.help_outline_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                SizedBox(width: 12),
                Text(
                  'Assignment Assistant',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
              ],
            ),

            SizedBox(height: 20),

            // Assignment dropdown
            Text(
              'Select Assignment',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: Colors.grey[700],
              ),
            ),
            SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[300]!),
              ),
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedAssignment,
                  hint: Text(
                    "Select assignment to submit",
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                  icon: Icon(Icons.keyboard_arrow_down_rounded,
                      color: accentColor),
                  isExpanded: true,
                  elevation: 16,
                  style: TextStyle(color: textColor, fontSize: 15),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedAssignment = newValue;

                      // Find full assignment details
                      if (newValue != null) {
                        _selectedAssignmentDetails =
                            _pendingAssignments.firstWhere(
                          (assignment) => assignment['title'] == newValue,
                          orElse: () => <String, dynamic>{},
                        );
                      } else {
                        _selectedAssignmentDetails = null;
                      }
                    });
                  },
                  items: _pendingAssignments
                      .map<DropdownMenuItem<String>>((assignment) {
                    return DropdownMenuItem<String>(
                      value: assignment['title'],
                      child: Text(assignment['title']),
                    );
                  }).toList(),
                ),
              ),
            ),

            SizedBox(height: 20),

            // File upload area
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: Colors.grey[300]!,
                  width: 1,
                ),
              ),
              child: Column(
                children: [
                  Container(
                    padding: EdgeInsets.all(30),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.grey[200]!,
                        style: BorderStyle.solid,
                        width: 2,
                      ),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _selectedFileName != null
                              ? Icons.check_circle_outline
                              : Icons.cloud_upload_outlined,
                          size: 48,
                          color: _selectedFileName != null
                              ? Colors.green[600]
                              : Colors.grey[400],
                        ),
                        SizedBox(height: 12),
                        Text(
                          _selectedFileName ?? "Drop your file here",
                          style: TextStyle(
                            fontSize: 16,
                            color: _selectedFileName != null
                                ? Colors.green[600]
                                : Colors.grey[600],
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 8),
                        Text(
                          "Supported formats: PDF, DOC, JPG, JPEG, PNG",
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[500],
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _selectFile,
                          icon: Icon(Icons.attach_file_rounded),
                          label: Text("SELECT FILE"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: accentColor,
                            foregroundColor: Colors.white,
                            padding: EdgeInsets.symmetric(
                                horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 20),

                  // Assignment details if selected
                  if (_selectedAssignmentDetails != null) ...[
                    Container(
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.blue[50],
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.blue[100]!),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Assignment Details',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue[800],
                            ),
                          ),
                          Divider(height: 16),
                          _buildAssignmentDetailRow(
                            'Due Date:',
                            DateFormat('dd MMM yyyy').format(
                              DateTime.parse(
                                  _selectedAssignmentDetails!['dueDate']),
                            ),
                            Icons.calendar_today_rounded,
                          ),
                          _buildAssignmentDetailRow(
                            'Description:',
                            _selectedAssignmentDetails!['description'] ??
                                'No description provided',
                            Icons.description_outlined,
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 20),
                  ],

                  // Submit button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _submitAssignment,
                      icon: Icon(Icons.send_rounded),
                      label: Text(
                        "SUBMIT ASSIGNMENT",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 3,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAssignmentDetailRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: Colors.blue[700]),
          SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.blue[700],
            ),
          ),
          SizedBox(width: 4),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: Colors.blue[800]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAssignmentReviewCard() {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: Colors.deepPurple,
          width: 1,
        ),
      ),
      child: Container(
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border(
            left: BorderSide(
              color: Colors.deepPurple,
              width: 5,
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Card header
            Row(
              children: [
                Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.deepPurple,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.rate_review_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                SizedBox(width: 12),
                Text(
                  'Assignment Reviews',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
              ],
            ),

            SizedBox(height: 16),

            if (_submittedAssignments.isEmpty)
              _buildEmptyStateMessage(
                'No reviews yet',
                'Your submitted assignments will be reviewed by your teachers and feedback will appear here.',
                Icons.feedback_outlined,
                Colors.deepPurple[200]!,
              )
            else
              Column(
                children: _submittedAssignments.take(2).map((assignment) {
                  final hasFeedback = assignment['feedback'] != null &&
                      assignment['feedback'].toString().isNotEmpty;
                  final hasScore = assignment['score'] != null &&
                      assignment['score'].toString().isNotEmpty;

                  return Container(
                    margin: EdgeInsets.only(bottom: 12),
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey[200]!),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          blurRadius: 4,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                assignment['title'],
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            if (hasScore)
                              Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.green[50],
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: Colors.green[200]!),
                                ),
                                child: Text(
                                  'Score: ${assignment['score']}',
                                  style: TextStyle(
                                    color: Colors.green[700],
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Submitted on: ${DateFormat('dd MMM yyyy').format(DateTime.parse(assignment['updatedAt']))}',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                        if (hasFeedback) ...[
                          SizedBox(height: 12),
                          Text(
                            'Feedback:',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          SizedBox(height: 4),
                          Container(
                            padding: EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.grey[50],
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.grey[200]!),
                            ),
                            child: Text(
                              assignment['feedback'] ??
                                  'No feedback provided yet.',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey[800],
                              ),
                            ),
                          ),
                        ] else ...[
                          SizedBox(height: 12),
                          Container(
                            padding: EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.orange[50],
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.orange[200]!),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.hourglass_bottom,
                                  size: 16,
                                  color: Colors.orange[700],
                                ),
                                SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    'Awaiting feedback from your teacher',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: Colors.orange[700],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  );
                }).toList(),
              ),

            SizedBox(height: 12),

            // View all button
            if (_submittedAssignments.length > 2)
              Center(
                child: TextButton.icon(
                  onPressed: () {
                    // Navigate to view all reviews
                  },
                  icon: Icon(Icons.visibility_outlined),
                  label: Text('View all reviews'),
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.deepPurple,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPendingAssignmentsCard() {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: Colors.amber[700]!,
          width: 1,
        ),
      ),
      child: Container(
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border(
            left: BorderSide(
              color: Colors.amber[700]!,
              width: 5,
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Card header
            Row(
              children: [
                Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.amber[700],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.pending_actions_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                SizedBox(width: 12),
                Text(
                  'Pending Assignments',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                Spacer(),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.amber[50],
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '${_pendingAssignments.length} pending',
                    style: TextStyle(
                      color: Colors.amber[900],
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),

            SizedBox(height: 16),

            if (_pendingAssignments.isEmpty)
              _buildEmptyStateMessage(
                'All caught up!',
                'You have no pending assignments at the moment.',
                Icons.check_circle_outline,
                Colors.green,
              )
            else
              Column(
                children: _pendingAssignments.take(3).map((assignment) {
                  // Calculate days left
                  final dueDate = DateTime.parse(assignment['dueDate']);
                  final today = DateTime.now();
                  final daysLeft = dueDate.difference(today).inDays;
                  final bool isUrgent = daysLeft <= 2;

                  return Container(
                    margin: EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey[200]!),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          blurRadius: 4,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: () => _selectAssignment(assignment),
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Row(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: isUrgent
                                      ? Colors.red[100]
                                      : Colors.amber[100],
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Center(
                                  child: Icon(
                                    isUrgent
                                        ? Icons.warning_rounded
                                        : Icons.assignment_outlined,
                                    color: isUrgent
                                        ? Colors.red[700]
                                        : Colors.amber[700],
                                    size: 20,
                                  ),
                                ),
                              ),
                              SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      assignment['title'],
                                      style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 14,
                                        color: textColor,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    SizedBox(height: 4),
                                    Text(
                                      'Due: ${DateFormat('dd MMM yyyy').format(dueDate)}',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: isUrgent
                                      ? Colors.red[50]
                                      : Colors.amber[50],
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: isUrgent
                                        ? Colors.red[200]!
                                        : Colors.amber[200]!,
                                  ),
                                ),
                                child: Text(
                                  daysLeft < 0
                                      ? 'Overdue'
                                      : daysLeft == 0
                                          ? 'Due today'
                                          : '$daysLeft days left',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: isUrgent
                                        ? Colors.red[700]
                                        : Colors.amber[700],
                                  ),
                                ),
                              ),
                              SizedBox(width: 8),
                              Icon(
                                Icons.arrow_forward_ios_rounded,
                                size: 14,
                                color: Colors.grey[400],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),

            SizedBox(height: 12),

            // View all button
            if (_pendingAssignments.length > 3)
              Center(
                child: TextButton.icon(
                  onPressed: () {
                    // Navigate to view all pending assignments
                  },
                  icon: Icon(Icons.visibility_outlined),
                  label: Text('View all pending assignments'),
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.amber[700],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmittedAssignmentsCard() {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: Colors.green[700]!,
          width: 1,
        ),
      ),
      child: Container(
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border(
            left: BorderSide(
              color: Colors.green[700]!,
              width: 5,
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Card header
            Row(
              children: [
                Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.green[700],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.check_circle_outline_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                SizedBox(width: 12),
                Text(
                  'Submitted Assignments',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                Spacer(),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green[50],
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '${_submittedAssignments.length} completed',
                    style: TextStyle(
                      color: Colors.green[700],
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),

            SizedBox(height: 16),

            if (_submittedAssignments.isEmpty)
              _buildEmptyStateMessage(
                'No submissions yet',
                'Your completed assignments will appear here.',
                Icons.assignment_turned_in_outlined,
                Colors.green[300]!,
              )
            else
              Column(
                children: _submittedAssignments.take(3).map((assignment) {
                  final hasScore = assignment['score'] != null &&
                      assignment['score'].toString().isNotEmpty;

                  return Container(
                    margin: EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey[200]!),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          blurRadius: 4,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: Colors.green[100],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Center(
                              child: Icon(
                                Icons.assignment_turned_in_outlined,
                                color: Colors.green[700],
                                size: 20,
                              ),
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  assignment['title'],
                                  style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                    color: textColor,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Submitted: ${DateFormat('dd MMM yyyy').format(DateTime.parse(assignment['updatedAt']))}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (hasScore)
                            Container(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.green[50],
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.green[200]!),
                              ),
                              child: Text(
                                'Score: ${assignment['score']}',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green[700],
                                ),
                              ),
                            )
                          else
                            Container(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.orange[50],
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.orange[200]!),
                              ),
                              child: Text(
                                'Pending',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.orange[700],
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),

            SizedBox(height: 12),

            // View all button
            if (_submittedAssignments.length > 3)
              Center(
                child: TextButton.icon(
                  onPressed: () {
                    // Navigate to view all submitted assignments
                  },
                  icon: Icon(Icons.visibility_outlined),
                  label: Text('View all submissions'),
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.green[700],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyStateMessage(
      String title, String subtitle, IconData icon, Color color) {
    return Container(
      padding: EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 48,
            color: color.withOpacity(0.7),
          ),
          SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color.withOpacity(0.8),
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 14,
              color: color.withOpacity(0.7),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

// Helper class for responsive grid layout
class GridLayout extends StatelessWidget {
  final List<Widget> children;
  final double spacing;

  const GridLayout({
    Key? key,
    required this.children,
    this.spacing = 16,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 600) {
          // Mobile layout (1 column)
          return Column(
            children: children.map((child) {
              return Padding(
                padding: EdgeInsets.only(bottom: spacing),
                child: child,
              );
            }).toList(),
          );
        } else {
          // Tablet/Desktop layout (2 columns)
          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Left column (2/3 width)
              Expanded(
                flex: 2,
                child: Column(
                  children: [
                    children[0],
                    SizedBox(height: spacing),
                    children[2],
                  ],
                ),
              ),
              SizedBox(width: spacing),
              // Right column (1/3 width)
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    children[1],
                    SizedBox(height: spacing),
                    children[3],
                  ],
                ),
              ),
            ],
          );
        }
      },
    );
  }
}
