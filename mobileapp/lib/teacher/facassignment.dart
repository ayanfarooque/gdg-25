import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';

import '../components/teacherheader.dart';
import '../components/footer.dart';
import '../components/assignmentSidebar.dart';
import 'package:percent_indicator/percent_indicator.dart';

class FacAssignmentLanding extends StatefulWidget {
  @override
  State<FacAssignmentLanding> createState() => _FacAssignmentLandingState();
}

class _FacAssignmentLandingState extends State<FacAssignmentLanding>
    with SingleTickerProviderStateMixin {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  int _selectedIndex = 1;
  String? _selectedFileName;
  Map<String, dynamic>? _selectedAssignment;
  List<dynamic> _assignments = [];
  List<dynamic> _submissions = [];
  bool _isLoading = true;
  bool _isSidebarVisible = false;
  String _searchTerm = '';
  String _filterStatus = 'all';
  TabController? _tabController;

  // Theme colors
  final Color teacherPrimaryColor = const Color(0xFFE195AB);
  final Color backgroundColor = const Color(0xFFF5F5DD);
  final Color textColor = Colors.black87;
  final Color accentColor = const Color(0xFF49ABB0);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadAssignmentsData();
  }

  @override
  void dispose() {
    _tabController?.dispose();
    super.dispose();
  }

  Future<void> _loadAssignmentsData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Load submissions.json data
      final String submissionsResponse =
          await rootBundle.loadString('lib/data/submissions.json');
      final submissionsData = await json.decode(submissionsResponse);

      setState(() {
        _assignments = submissionsData['assignments'];
        _submissions = submissionsData['submissions'];
        _selectedAssignment =
            _assignments.isNotEmpty ? _assignments.first : null;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _handleAssignmentChange(String? assignmentId) {
    if (assignmentId != null) {
      setState(() {
        _selectedAssignment = _assignments.firstWhere(
          (assignment) => assignment['_id'] == assignmentId,
          orElse: () => _assignments.isNotEmpty ? _assignments.first : null,
        );
      });
    }
  }

  List<dynamic> get _filteredSubmissions {
    if (_selectedAssignment == null) return [];

    return _submissions.where((submission) {
      // Filter by selected assignment
      bool matchesAssignment =
          submission['assignmentId'] == _selectedAssignment!['_id'];

      // Filter by search term (student name)
      bool matchesSearch = _searchTerm.isEmpty ||
          (submission['student'] != null &&
              submission['student']['name'] != null &&
              submission['student']['name']
                  .toString()
                  .toLowerCase()
                  .contains(_searchTerm.toLowerCase()));

      // Filter by status
      bool matchesStatus = _filterStatus == 'all' ||
          (submission['status'] != null &&
              submission['status'] == _filterStatus);

      return matchesAssignment && matchesSearch && matchesStatus;
    }).toList();
  }

  Map<String, dynamic> _calculateSubmissionStats() {
    if (_selectedAssignment == null)
      return {
        'total': 0,
        'submitted': 0,
        'graded': 0,
        'late': 0,
      };

    final submissions = _submissions
        .where((sub) => sub['assignmentId'] == _selectedAssignment!['_id'])
        .toList();

    final total = submissions.length;
    final submitted = submissions
        .where((sub) =>
            sub['status'] != null &&
            ['submitted', 'late', 'graded', 'returned'].contains(sub['status']))
        .length;
    final graded = submissions
        .where((sub) =>
            sub['status'] != null &&
            ['graded', 'returned'].contains(sub['status']))
        .length;
    final late = submissions
        .where((sub) => sub['status'] != null && sub['status'] == 'late')
        .length;

    return {
      'total': total,
      'submitted': submitted,
      'graded': graded,
      'late': late,
    };
  }

  int? _calculateDaysRemaining() {
    if (_selectedAssignment == null || _selectedAssignment!['dueDate'] == null)
      return null;

    try {
      final today = DateTime.now();
      final dueDate = DateTime.parse(_selectedAssignment!['dueDate']);
      final difference = dueDate.difference(today);

      return difference.inDays;
    } catch (e) {
      print('Error calculating days remaining: $e');
      return null;
    }
  }

  void _toggleSidebar() {
    setState(() {
      _isSidebarVisible = !_isSidebarVisible;
    });
  }

  void _extendDeadline() {
    // In a real app, this would open a date picker and update the deadline
    if (_selectedAssignment != null) {
      final newDueDate = DateTime.parse(_selectedAssignment!['dueDate'])
          .add(Duration(days: 7));
      setState(() {
        _selectedAssignment!['dueDate'] = newDueDate.toIso8601String();
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Deadline extended by 7 days')),
      );
    }
  }

  void _sendReminder() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Reminder sent to students')),
    );
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
        Navigator.pushReplacementNamed(context, '/teacherassignment');
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

  @override
  Widget build(BuildContext context) {
    //final submissionStats = _calculateSubmissionStats();
    //final daysRemaining = _calculateDaysRemaining();

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: teacherPrimaryColor,
      drawer: Drawer(
        child: _buildAssignmentDrawer(),
      ),
      body: _isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: Colors.white,
              ),
            )
          : SafeArea(
              child: Stack(
                children: [
                  Column(
                    children: [
                      // Header section
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                        child: TeacherHeader(
                          onProfileTap: () {
                            Navigator.pushNamed(context, '/teacherprofile');
                          },
                          onNotificationTap: () {
                            Navigator.pushNamed(
                                context, '/teachernotifications');
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
                            child: SingleChildScrollView(
                              child: Column(
                                children: [
                                  const SizedBox(height: 20),

                                  // Title and New Assignment button
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 16.0),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          "ASSIGNMENTS",
                                          style: TextStyle(
                                            fontSize: 24,
                                            fontWeight: FontWeight.bold,
                                            color: textColor,
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            ElevatedButton.icon(
                                              onPressed: () {
                                                Navigator.pushNamed(
                                                    context, '/addassignment');
                                              },
                                              icon: const Icon(
                                                  Icons.add_circle_outline),
                                              label: const Text("NEW"),
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor:
                                                    teacherPrimaryColor,
                                                foregroundColor: Colors.white,
                                                elevation: 5,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),

                                  const SizedBox(height: 20),

                                  // Assignment Selection and Details Card
                                  _buildAssignmentSelectionCard(),

                                  const SizedBox(height: 20),

                                  // Submissions and Status Tab Section
                                  _buildTabsSection(),

                                  const SizedBox(height: 20),

                                  // AI Assignment Helper
                                  _buildAiAssignmentHelper(),

                                  const SizedBox(height: 20),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Inside your build method, replace the current sidebar code with this:
                  if (_isSidebarVisible)
                    Positioned(
                      top: 80,
                      left: 0,
                      bottom: 0,
                      child: AssignmentSidebar(
                        pendingAssignments: _assignments
                            .where((assignment) =>
                                assignment['status'] != null &&
                                assignment['status'] == 'active' &&
                                assignment['dueDate'] != null &&
                                assignment['code'] != null &&
                                assignment['title'] != null &&
                                assignment['_id'] != null)
                            .map<Map<String, String>>((assignment) {
                          try {
                            return {
                              'date': DateFormat('dd MMM').format(
                                  DateTime.parse(assignment['dueDate'])),
                              'subjectCode':
                                  "${assignment['code']} - ${assignment['title']}",
                              'assignmentId': assignment['_id'],
                            };
                          } catch (e) {
                            // Fallback for parsing errors
                            return {
                              'date': 'Date error',
                              'subjectCode':
                                  "${assignment['code'] ?? ''} - ${assignment['title'] ?? 'Untitled'}",
                              'assignmentId': assignment['_id'],
                            };
                          }
                        }).toList(),
                        submittedAssignments: _assignments
                            .where((assignment) =>
                                assignment['status'] != null &&
                                assignment['status'] == 'completed' &&
                                assignment['date'] != null &&
                                assignment['code'] != null &&
                                assignment['title'] != null &&
                                assignment['_id'] != null)
                            .map<Map<String, String>>((assignment) {
                          try {
                            return {
                              'date': DateFormat('dd MMM')
                                  .format(DateTime.parse(assignment['date'])),
                              'subjectCode':
                                  "${assignment['code']} - ${assignment['title']}",
                              'assignmentId': assignment['_id'],
                            };
                          } catch (e) {
                            // Fallback for parsing errors
                            return {
                              'date': 'Date error',
                              'subjectCode':
                                  "${assignment['code'] ?? ''} - ${assignment['title'] ?? 'Untitled'}",
                              'assignmentId': assignment['_id'],
                            };
                          }
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

  Widget _buildAssignmentDrawer() {
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        DrawerHeader(
          decoration: BoxDecoration(
            color: teacherPrimaryColor,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Assignments',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Manage your class assignments',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.8),
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
        ListTile(
          title: const Text(
            'Active Assignments',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          tileColor: Colors.grey.withOpacity(0.1),
        ),
        ..._assignments
            .where((assignment) => assignment['status'] == 'active')
            .map((assignment) {
          return ListTile(
            title: Text(assignment['title']),
            subtitle: Text(
                'Due: ${DateFormat('dd MMM yyyy').format(DateTime.parse(assignment['dueDate']))}'),
            leading: Icon(Icons.assignment, color: teacherPrimaryColor),
            onTap: () {
              _handleAssignmentChange(assignment['_id']);
              Navigator.pop(context);
            },
          );
        }).toList(),
        const Divider(),
        ListTile(
          title: const Text(
            'Completed Assignments',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          tileColor: Colors.grey.withOpacity(0.1),
        ),
        ..._assignments
            .where((assignment) => assignment['status'] == 'completed')
            .map((assignment) {
          return ListTile(
            title: Text(assignment['title']),
            subtitle: Text(
                'Completed on: ${DateFormat('dd MMM yyyy').format(DateTime.parse(assignment['date']))}'),
            leading: Icon(Icons.assignment_turned_in, color: Colors.green),
            onTap: () {
              _handleAssignmentChange(assignment['_id']);
              Navigator.pop(context);
            },
          );
        }).toList(),
      ],
    );
  }

  Widget _buildAssignmentSelectionCard() {
    final int? daysRemaining = _calculateDaysRemaining();
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 0,
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Assignment Selection Dropdown
            Text(
              "Select Assignment",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: _selectedAssignment?['_id'],
                  hint: Text("Select an assignment"),
                  items: _assignments.map((assignment) {
                    return DropdownMenuItem<String>(
                      value: assignment['_id'],
                      child: Text(
                        "${assignment['code']} - ${assignment['title']}",
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  }).toList(),
                  onChanged: _handleAssignmentChange,
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Assignment Details
            if (_selectedAssignment != null) ...[
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 3,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _selectedAssignment!['title'],
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _selectedAssignment!['subject'],
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[700],
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _selectedAssignment!['description'] ??
                              'No description available',
                          style: TextStyle(
                            fontSize: 14,
                          ),
                          maxLines: 4, // Limit number of lines
                          overflow: TextOverflow
                              .ellipsis, // Add ellipsis for overflow
                        ),

                        const SizedBox(height: 16),

                        _buildDueDateInfoRow(),
                        const SizedBox(height: 8),

                        // Total Marks
                        _buildInfoRow(
                          "Total Marks",
                          "${_selectedAssignment!['totalMarks'] ?? 'Not set'}",
                        ),
                        const SizedBox(height: 8),

                        // Days Remaining
                        _buildInfoRow(
                          "Days Remaining",
                          daysRemaining != null
                              ? "$daysRemaining days"
                              : "Date error",
                          isHighlighted:
                              daysRemaining != null && daysRemaining < 7,
                          highlightColor:
                              daysRemaining != null && daysRemaining < 3
                                  ? Colors.red
                                  : Colors.orange,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  // Fix right side width issue
                  // Adjust flex from 2 to 3 to give more space for info rows
                  Expanded(
                    flex: 2,
                    child: LayoutBuilder(builder: (context, constraints) {
                      return Container(
                        width: constraints.maxWidth,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Due Date - Safe approach with function call
                          ],
                        ),
                      );
                    }),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 16),

              // Attachments Section
              if (_selectedAssignment!['attachments'] != null &&
                  _selectedAssignment!['attachments'].isNotEmpty) ...[
                Text(
                  "Attachments",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[700],
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    ..._selectedAssignment!['attachments']
                        .map<Widget>((attachment) {
                      return _buildAttachmentChip(
                        attachment['name'],
                        attachment['size'],
                      );
                    }).toList(),
                  ],
                ),
                const SizedBox(height: 16),
              ],

              // Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton.icon(
                    onPressed: _sendReminder,
                    icon: Icon(Icons.notifications_active, size: 16),
                    label: Text("Send Reminder"),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: accentColor,
                      side: BorderSide(color: accentColor),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton.icon(
                    onPressed: _extendDeadline,
                    icon: Icon(Icons.date_range, size: 16),
                    label: Text("Extend Deadline"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: teacherPrimaryColor,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  // Modify the _buildTabsSection method to reduce height and add scrollable content

  Widget _buildTabsSection() {
    final Map<String, dynamic> submissionStats = _calculateSubmissionStats();
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 0,
          ),
        ],
      ),
      child: Column(
        children: [
          // Stats Row
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatBox(
                    "Total", submissionStats['total'].toString(), Colors.blue),
                _buildStatBox(
                    "Submitted",
                    submissionStats['submitted'].toString(),
                    teacherPrimaryColor),
                _buildStatBox("Graded", submissionStats['graded'].toString(),
                    Colors.green),
                _buildStatBox(
                    "Late", submissionStats['late'].toString(), Colors.orange),
              ],
            ),
          ),

          // Divider
          const Divider(height: 1),

          // Tabs
          TabBar(
            controller: _tabController,
            labelColor: teacherPrimaryColor,
            unselectedLabelColor: Colors.grey,
            indicatorColor: teacherPrimaryColor,
            tabs: const [
              Tab(text: "SUBMISSIONS"),
              Tab(text: "ANALYTICS"),
            ],
          ),

          // Tab Content with reduced height to fix the overflow
          Container(
            // Reduce the height from 350 to 270 to avoid the 122px overflow
            height: 270,
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildSubmissionsTab(),
                SingleChildScrollView(
                  // Make the analytics tab scrollable
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: _buildAnalyticsTab(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubmissionsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search and Filter Row
          Row(
            children: [
              Expanded(
                flex: 3,
                child: TextField(
                  onChanged: (value) {
                    setState(() {
                      _searchTerm = value;
                    });
                  },
                  decoration: InputDecoration(
                    contentPadding:
                        EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                    hintText: "Search students...",
                    prefixIcon: Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 2,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[300]!),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      isExpanded: true,
                      value: _filterStatus,
                      items: [
                        DropdownMenuItem(value: 'all', child: Text("All")),
                        DropdownMenuItem(
                            value: 'submitted', child: Text("Submitted")),
                        DropdownMenuItem(
                            value: 'graded', child: Text("Graded")),
                        DropdownMenuItem(value: 'late', child: Text("Late")),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _filterStatus = value!;
                        });
                      },
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Submissions List - Make sure it's in an Expanded widget
          Expanded(
            child: _filteredSubmissions.isEmpty
                ? Center(
                    child: Text(
                      "No submissions found",
                      style: TextStyle(color: Colors.grey[500]),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true, // Important to prevent overflow
                    physics: AlwaysScrollableScrollPhysics(),
                    itemCount: _filteredSubmissions.length,
                    itemBuilder: (context, index) {
                      final submission = _filteredSubmissions[index];
                      return _buildSubmissionCard(submission);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  // Modify the _buildAnalyticsTab method to be more compact

  Widget _buildAnalyticsTab() {
    final Map<String, dynamic> submissionStats = _calculateSubmissionStats();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Make this section more compact
          Text(
            "Submission Timeline",
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8), // Reduced from 16

          // Reduce the height of this container
          Container(
            height: 60, // Reduced from 100
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: Text(
                "Submission timeline visualization",
                style: TextStyle(color: Colors.grey[500], fontSize: 12),
              ),
            ),
          ),

          const SizedBox(height: 12), // Reduced from 24

          Text(
            "Grade Distribution",
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8), // Reduced from 16

          // Make grade bars shorter
          Row(
            children: [
              _buildGradeBar("A (90-100%)", 0.35, Colors.green),
              _buildGradeBar("B (80-89%)", 0.25, Colors.blue),
              _buildGradeBar("C (70-79%)", 0.20, Colors.amber),
              _buildGradeBar("D (60-69%)", 0.15, Colors.orange),
              _buildGradeBar("F (<60%)", 0.05, Colors.red),
            ],
          ),

          const SizedBox(height: 12), // Reduced from 24

          Text(
            "Submission Status",
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8), // Reduced from 16

          // Submission status distribution
          LinearPercentIndicator(
            lineHeight: 16.0, // Reduced from 20
            percent: submissionStats['submitted'] /
                (submissionStats['total'] > 0 ? submissionStats['total'] : 1),
            center: Text(
              "${(submissionStats['submitted'] / (submissionStats['total'] > 0 ? submissionStats['total'] : 1) * 100).toStringAsFixed(0)}%",
              style: const TextStyle(
                  fontSize: 11, fontWeight: FontWeight.bold), // Smaller font
            ),
            progressColor: teacherPrimaryColor,
            backgroundColor: Colors.grey[200],
            barRadius: const Radius.circular(8),
          ),
          const SizedBox(height: 4), // Reduced from 8
          Text(
            "${submissionStats['submitted']} out of ${submissionStats['total']} students have submitted",
            style: TextStyle(
              fontSize: 12, // Reduced from 14
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAiAssignmentHelper() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.smart_toy,
                color: accentColor,
                size: 24,
              ),
              const SizedBox(width: 12),
              Text(
                "AI ASSIGNMENT ASSISTANT",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            "Generate new assignments, review submissions, or create rubrics with AI assistance.",
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[700],
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {},
                  icon: Icon(Icons.auto_awesome),
                  label: Text("Generate Assignment"),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: accentColor,
                    side: BorderSide(color: accentColor),
                    padding: EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: Icon(Icons.grading),
                  label: Text("AI Grading Assistance"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: teacherPrimaryColor,
                    foregroundColor: Colors.white,
                    padding: EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value,
      {bool isHighlighted = false, Color highlightColor = Colors.red}) {
    return Row(
      children: [
        Text(
          "$label: ",
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.grey[700],
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: isHighlighted ? FontWeight.bold : FontWeight.normal,
            color: isHighlighted ? highlightColor : Colors.black,
          ),
        ),
      ],
    );
  }

  Widget _buildAttachmentChip(String name, String size) {
    IconData icon;
    if (name.endsWith('.pdf')) {
      icon = Icons.picture_as_pdf;
    } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
      icon = Icons.article;
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      icon = Icons.table_chart;
    } else if (name.endsWith('.jpg') ||
        name.endsWith('.png') ||
        name.endsWith('.jpeg')) {
      icon = Icons.image;
    } else {
      icon = Icons.insert_drive_file;
    }

    return Chip(
      avatar: Icon(icon, size: 16),
      label: Text("$name ($size)"),
      backgroundColor: Colors.grey[100],
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 0),
    );
  }

  Widget _buildStatBox(String label, String value, Color color) {
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Center(
            child: Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[700],
          ),
        ),
      ],
    );
  }

  Widget _buildSubmissionCard(dynamic submission) {
    String status = submission['status'] ?? 'pending';
    Color statusColor = Colors.grey;

    switch (status) {
      case 'submitted':
        statusColor = Colors.blue;
        break;
      case 'graded':
        statusColor = Colors.green;
        break;
      case 'late':
        statusColor = Colors.orange;
        break;
      case 'returned':
        statusColor = Colors.purple;
        break;
    }

    String? submittedDate;
    if (submission['submittedAt'] != null) {
      try {
        submittedDate = DateFormat.yMMMd()
            .format(DateTime.parse(submission['submittedAt']));
      } catch (e) {
        submittedDate = "Date error";
      }
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundImage: submission['student'] != null &&
                          submission['student']['avatar'] != null
                      ? NetworkImage(submission['student']['avatar'])
                      : null,
                  child: submission['student'] == null ||
                          submission['student']['avatar'] == null
                      ? Text(submission['student'] != null
                          ? submission['student']['name'][0]
                          : '?')
                      : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        submission['student'] != null
                            ? submission['student']['name']
                            : 'Unknown Student',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      if (submission['student'] != null &&
                          submission['student']['email'] != null)
                        Text(
                          submission['student']['email'],
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                    ],
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    status.toUpperCase(),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: statusColor,
                    ),
                  ),
                ),
              ],
            ),
            if (submittedDate != null) ...[
              const SizedBox(height: 12),
              Text(
                "Submitted on: $submittedDate",
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
            if (submission['files'] != null &&
                submission['files'].isNotEmpty) ...[
              const SizedBox(height: 12),
              const Text(
                "Attached Files:",
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  ...submission['files'].map<Widget>((file) {
                    return _buildFileChip(file['name'], file['size']);
                  }).toList(),
                ],
              ),
            ],
            if (submission['comments'] != null &&
                submission['comments'].isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Student Comments:",
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      submission['comments'],
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[800],
                      ),
                      maxLines: 3, // Limit number of lines
                      overflow:
                          TextOverflow.ellipsis, // Add ellipsis for overflow
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.visibility, size: 16),
                  label: const Text("View"),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.grading, size: 16),
                  label: const Text("Grade"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: teacherPrimaryColor,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFileChip(String fileName, String fileSize) {
    IconData icon;
    Color color;

    if (fileName.endsWith('.pdf')) {
      icon = Icons.picture_as_pdf;
      color = Colors.red;
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      icon = Icons.description;
      color = Colors.blue;
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      icon = Icons.table_chart;
      color = Colors.green;
    } else if (fileName.endsWith('.jpg') ||
        fileName.endsWith('.png') ||
        fileName.endsWith('.jpeg')) {
      icon = Icons.image;
      color = Colors.purple;
    } else {
      icon = Icons.insert_drive_file;
      color = Colors.grey;
    }

    return InkWell(
      onTap: () {
        // Handle file view/download
      },
      child: Chip(
        avatar: Icon(icon, size: 16, color: color),
        label: Text("$fileName ($fileSize)"),
        backgroundColor: Colors.grey[100],
        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 0),
      ),
    );
  }

  Widget _buildDueDateInfoRow() {
    if (_selectedAssignment == null ||
        _selectedAssignment!['dueDate'] == null) {
      return _buildInfoRow("Due Date", "Not set");
    }

    try {
      String formattedDate = DateFormat('MMM d, yyyy').format(
        DateTime.parse(_selectedAssignment!['dueDate']),
      );
      return _buildInfoRow("Due Date", formattedDate);
    } catch (e) {
      return _buildInfoRow("Due Date", "Invalid date format");
    }
  }

  // Modify the _buildGradeBar method to have shorter bars

  Widget _buildGradeBar(String label, double percentage, Color color) {
    return Expanded(
      child: Column(
        children: [
          Container(
            height: 70, // Reduced from 100
            width: 16, // Reduced from 20
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  height: 70 * percentage, // Adjust according to new height
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 4), // Reduced from 8
          Text(
            "${(percentage * 100).toInt()}%",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 10, // Reduced from 12
            ),
          ),
          const SizedBox(height: 2), // Reduced from 4
          Text(
            label,
            style: TextStyle(
              fontSize: 9, // Reduced from 10
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
