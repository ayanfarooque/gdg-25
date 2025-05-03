import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:dummyapp/components/footer.dart';
import 'package:intl/intl.dart';

class ClassroomDetailScreen extends StatefulWidget {
  final String classroomId;

  const ClassroomDetailScreen({
    Key? key,
    required this.classroomId,
  }) : super(key: key);

  @override
  State<ClassroomDetailScreen> createState() => _ClassroomDetailScreenState();
}

class _ClassroomDetailScreenState extends State<ClassroomDetailScreen> {
  int _selectedIndex = 5; // Set to 5 for Classroom in the footer
  String _activeTab = 'assignments'; // Default tab
  bool _isLoading = true;
  Map<String, dynamic>? _classroom;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadClassroomDetails();
  }

  Future<void> _loadClassroomDetails() async {
    try {
      // Load the JSON file (in a real app, this would be an API call)
      final String response =
          await rootBundle.loadString('lib/data/classroom.json');
      final data = await json.decode(response);

      // Find the classroom by ID
      final classroomData = (data as List).firstWhere(
          (classroom) => classroom['_id'] == widget.classroomId,
          orElse: () => null);

      if (classroomData == null) {
        setState(() {
          _isLoading = false;
          _error = 'Classroom not found';
        });
        return;
      }

      // Mock assignments for UI display
      List<Map<String, dynamic>> assignments = [
        {
          'id': '${widget.classroomId}-a1',
          'title': '${classroomData['subject']} Assignment 1',
          'dueDate': '2025-04-25',
          'status': 'pending',
          'points': 100
        },
        {
          'id': '${widget.classroomId}-a2',
          'title': '${classroomData['subject']} Assignment 2',
          'dueDate': '2025-04-28',
          'status': 'pending',
          'points': 75
        },
        {
          'id': '${widget.classroomId}-a3',
          'title': '${classroomData['subject']} Homework',
          'submitDate': '2025-04-10',
          'score': 92,
          'points': 100,
          'status': 'completed'
        }
      ];

      // Mock grades data
      List<Map<String, dynamic>> grades = [
        {
          'id': '${widget.classroomId}-g1',
          'title': '${classroomData['subject']} Midterm Exam',
          'score': 87,
          'maxScore': 100,
          'date': '2025-03-15',
          'weight': 30
        },
        {
          'id': '${widget.classroomId}-g2',
          'title': '${classroomData['subject']} Quizzes Average',
          'score': 42,
          'maxScore': 50,
          'date': '2025-04-01',
          'weight': 20
        }
      ];

      // Prepare student data with mock details
      List<Map<String, dynamic>> students = [];
      for (int i = 0; i < (classroomData['students'] as List).length; i++) {
        students.add({
          'id': classroomData['students'][i],
          'name': '${classroomData['subject']} Student ${i + 1}',
          'email': 'student${i + 1}@example.com',
          'role': 'Student'
        });
      }

      // Add additional data to the classroom object
      classroomData['assignmentsData'] = assignments;
      classroomData['gradesData'] = grades;
      classroomData['studentsData'] = students;

      setState(() {
        _classroom = Map<String, dynamic>.from(classroomData);
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = 'Error loading classroom data: $e';
      });
      print('Error loading classroom data: $e');
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    // Handle navigation based on index
  }

  void _switchTab(String tab) {
    setState(() {
      _activeTab = tab;
    });
  }

  Color _getBannerColor() {
    if (_classroom == null || _classroom!['subject'] == null) {
      return const Color(0xFF4285F4); // Default blue
    }

    final Map<String, Color> subjectColors = {
      'Math': const Color(0xFF4285F4), // Blue
      'Science': const Color(0xFF0F9D58), // Green
      'History': const Color(0xFFDB4437), // Red
      'English': const Color(0xFFF4B400), // Yellow
      'Art': const Color(0xFFAA46BC), // Purple
      'Music': const Color(0xFFE91E63), // Pink
      'Computer Science': const Color(0xFF00ACC1), // Teal
      'Foreign Language': const Color(0xFFFF6D00), // Orange
      'Physical Education': const Color(0xFF5E35B1), // Deep Purple
    };

    return subjectColors[_classroom!['subject']] ?? const Color(0xFF4285F4);
  }

  Widget _getStatusBadge(String status, int? daysLeft) {
    final Map<String, Color> statusColors = {
      'pending': daysLeft != null && daysLeft <= 2
          ? const Color(0xFFFAE1E1) // Light red
          : const Color(0xFFFFF3CD), // Light yellow
      'completed': const Color(0xFFD4EDDA), // Light green
      'late': const Color(0xFFE1D9F6), // Light purple
      'canceled': const Color(0xFFFAE1E1), // Light red
    };

    final Map<String, Color> statusTextColors = {
      'pending': daysLeft != null && daysLeft <= 2
          ? const Color(0xFFDC3545) // Red
          : const Color(0xFFE0A800), // Yellow
      'completed': const Color(0xFF28A745), // Green
      'late': const Color(0xFF6F42C1), // Purple
      'canceled': const Color(0xFFDC3545), // Red
    };

    String statusText = status;
    if (status == 'pending') {
      statusText = daysLeft != null && daysLeft <= 0
          ? 'Overdue'
          : 'Due in $daysLeft days';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: statusColors[status] ?? Colors.grey.shade200,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        statusText,
        style: TextStyle(
          color: statusTextColors[status] ?? Colors.black87,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  int _calculateDaysLeft(String dateStr) {
    final dueDate = DateTime.parse(dateStr);
    final today = DateTime.now();
    return dueDate.difference(today).inDays;
  }

  String _calculateOverallGrade() {
    if (_classroom == null ||
        _classroom!['gradesData'] == null ||
        (_classroom!['gradesData'] as List).isEmpty) {
      return 'N/A';
    }

    final grades = _classroom!['gradesData'] as List;
    final gradedItems =
        grades.where((grade) => grade['score'] != null).toList();

    if (gradedItems.isEmpty) {
      return 'Pending';
    }

    double totalWeightedScore = 0;
    double totalWeight = 0;

    for (var grade in gradedItems) {
      final score = grade['score'] as int;
      final maxScore = grade['maxScore'] as int;
      final weight = grade['weight'] as int;

      totalWeightedScore += (score / maxScore) * weight;
      totalWeight += weight;
    }

    return '${(totalWeightedScore / totalWeight * 100).round()}%';
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Classroom Details'),
          backgroundColor: Colors.white,
          elevation: 1,
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (_error != null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Classroom Details'),
          backgroundColor: Colors.white,
          elevation: 1,
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.error_outline,
                  size: 60,
                  color: Colors.red.shade300,
                ),
                const SizedBox(height: 16),
                Text(
                  'Error',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.red.shade800,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  _error!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF49ABB0),
                  ),
                  child: const Text('Go Back'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (_classroom == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Classroom Not Found'),
          backgroundColor: Colors.white,
          elevation: 1,
        ),
        body: const Center(
          child: Text('Classroom not found'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(_classroom!['name']),
        backgroundColor: Colors.white,
        elevation: 1,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          // Banner
          Container(
            height: 180,
            width: double.infinity,
            decoration: BoxDecoration(
              color: _getBannerColor(),
              image: _classroom!['coverImage'] != null &&
                      _classroom!['coverImage']['url'] != null
                  ? DecorationImage(
                      image: NetworkImage(_classroom!['coverImage']['url']),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withOpacity(0.2),
                    Colors.black.withOpacity(0.6),
                  ],
                ),
              ),
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _classroom!['name'],
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          _classroom!['subject'],
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          _classroom!['gradeLevel'],
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        _classroom!['code'],
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.8),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Stats Cards
          Container(
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 0),
            transform: Matrix4.translationValues(0, -20, 0),
            child: Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatItem(
                      icon: Icons.people,
                      iconColor: const Color(0xFF4285F4),
                      label: 'Students',
                      value:
                          (_classroom!['students'] as List).length.toString(),
                    ),
                    _buildStatItem(
                      icon: Icons.score,
                      iconColor: const Color(0xFF0F9D58),
                      label: 'Average',
                      value: _classroom!['performanceStats'] != null
                          ? '${_classroom!['performanceStats']['averageScore']}%'
                          : '0%',
                    ),
                    _buildStatItem(
                      icon: Icons.timer,
                      iconColor: const Color(0xFFDB4437),
                      label: 'Pending',
                      value: _classroom!['performanceStats'] != null
                          ? '${_classroom!['performanceStats']['assignmentsPending']}'
                          : '0',
                    ),
                    _buildStatItem(
                      icon: Icons.check_circle,
                      iconColor: const Color(0xFFAA46BC),
                      label: 'Completed',
                      value: _classroom!['performanceStats'] != null
                          ? '${_classroom!['performanceStats']['assignmentsCompleted']}'
                          : '0',
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Tab Navigation
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildTabButton('assignments', 'Assignments'),
                  _buildTabButton('announcements', 'Announcements'),
                  _buildTabButton('resources', 'Resources'),
                  _buildTabButton('students', 'Students'),
                  _buildTabButton('grades', 'Grades'),
                ],
              ),
            ),
          ),

          const Divider(height: 1),

          // Tab content
          Expanded(
            child: _buildTabContent(),
          ),
        ],
      ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildStatItem({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            color: iconColor,
            size: 20,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  Widget _buildTabButton(String tabId, String label) {
    final bool isActive = _activeTab == tabId;

    return GestureDetector(
      onTap: () => _switchTab(tabId),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: isActive ? const Color(0xFF49ABB0) : Colors.transparent,
              width: 2,
            ),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? const Color(0xFF49ABB0) : Colors.grey.shade700,
            fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildTabContent() {
    switch (_activeTab) {
      case 'assignments':
        return _buildAssignmentsTab();
      case 'announcements':
        return _buildAnnouncementsTab();
      case 'resources':
        return _buildResourcesTab();
      case 'students':
        return _buildStudentsTab();
      case 'grades':
        return _buildGradesTab();
      default:
        return Container();
    }
  }

  Widget _buildAssignmentsTab() {
    final assignments = _classroom!['assignmentsData'] as List;
    final pendingAssignments =
        assignments.where((a) => a['status'] == 'pending').toList();
    final completedAssignments =
        assignments.where((a) => a['status'] == 'completed').toList();

    if (assignments.isEmpty) {
      return _buildEmptyState(
        icon: Icons.assignment,
        title: 'No assignments',
        message: 'No assignments have been posted in this classroom yet.',
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.assignment,
                      color: Color(0xFF49ABB0), size: 18),
                  const SizedBox(width: 8),
                  const Text(
                    'All Assignments',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: () {
                  // Navigate to all assignments
                },
                child: const Text('View All'),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // List of assignments
          ...assignments.map((assignment) {
            final String dueDate =
                assignment['dueDate'] ?? assignment['submitDate'];
            final DateTime date = DateTime.parse(dueDate);
            final int? daysLeft = assignment['dueDate'] != null
                ? _calculateDaysLeft(assignment['dueDate'])
                : null;

            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: assignment['status'] == 'completed'
                                ? Colors.green.shade50
                                : Colors.orange.shade50,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            assignment['status'] == 'completed'
                                ? Icons.check
                                : Icons.timer,
                            color: assignment['status'] == 'completed'
                                ? Colors.green
                                : Colors.orange,
                            size: 16,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                assignment['title'],
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Icon(
                                    Icons.calendar_today,
                                    size: 12,
                                    color: Colors.grey.shade600,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    DateFormat('MMM d, yyyy').format(date),
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Icon(
                                    Icons.grade,
                                    size: 12,
                                    color: Colors.grey.shade600,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${assignment['points']} points',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  _getStatusBadge(
                                      assignment['status'], daysLeft),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    if (assignment['status'] == 'completed' &&
                        assignment['score'] != null)
                      Container(
                        margin: const EdgeInsets.only(top: 12, left: 40),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.green.shade50,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Score: ${assignment['score']}',
                              style: TextStyle(
                                color: Colors.green.shade800,
                                fontWeight: FontWeight.w500,
                                fontSize: 13,
                              ),
                            ),
                            Text(
                              ' / ${assignment['points']}',
                              style: TextStyle(
                                color: Colors.green.shade600,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    Padding(
                      padding: const EdgeInsets.only(top: 12.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (assignment['status'] == 'pending')
                            ElevatedButton(
                              onPressed: () {
                                // Handle submit action
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF49ABB0),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 8),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              child: const Text(
                                'Submit',
                                style: TextStyle(fontSize: 12),
                              ),
                            ),
                          const SizedBox(width: 8),
                          OutlinedButton(
                            onPressed: () {
                              // Handle view details action
                            },
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: Colors.grey.shade300),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 8),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: Text(
                              'View Details',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade700,
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
          }).toList(),

          const SizedBox(height: 24),

          // Statistics header
          const Padding(
            padding: EdgeInsets.only(top: 8.0, bottom: 16.0),
            child: Text(
              'Assignment Statistics',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),

          // Stats cards
          Container(
            height: 120, // Fixed height
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                SizedBox(
                  width: MediaQuery.of(context).size.width *
                      0.32, // 32% of screen width
                  child: _buildAssignmentStatCard(
                    title: 'Pending',
                    value: pendingAssignments.length.toString(),
                    description: 'Need to complete',
                    icon: Icons.timer,
                    color: Colors.yellow,
                  ),
                ),
                const SizedBox(width: 8), // Increased spacing
                SizedBox(
                  child: _buildAssignmentStatCard(
                    title: 'Completed',
                    value: completedAssignments.length.toString(),
                    description: 'Submitted',
                    icon: Icons.check_circle,
                    color: Colors.green,
                  ),
                ),
                const SizedBox(width: 8), // Increased spacing
                SizedBox(
                  // 32% of screen width
                  child: _buildAssignmentStatCard(
                    title: 'Average Score',
                    value: completedAssignments.isNotEmpty
                        ? '${(completedAssignments.map((a) => a['score'] as int).reduce((a, b) => a + b) / completedAssignments.length).round()}%'
                        : 'N/A',
                    description: 'Your performance',
                    icon: Icons.bar_chart,
                    color: Colors.blue,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAssignmentStatCard({
    required String title,
    required String value,
    required String description,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: 14,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              description,
              style: TextStyle(
                fontSize: 10,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAnnouncementsTab() {
    final announcements = _classroom!['announcements'] as List?;

    if (announcements == null || announcements.isEmpty) {
      return _buildEmptyState(
        icon: Icons.campaign,
        title: 'No announcements',
        message: 'Check back later for updates from your teacher',
      );
    }

    final pinnedAnnouncements =
        announcements.where((a) => a['isPinned'] == true).toList();
    final regularAnnouncements =
        announcements.where((a) => a['isPinned'] != true).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.campaign, color: Color(0xFF6F42C1), size: 18),
              const SizedBox(width: 8),
              const Text(
                'Announcements',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (pinnedAnnouncements.isNotEmpty) ...[
            Text(
              'PINNED',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: Colors.grey.shade600,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            ...pinnedAnnouncements.map(_buildAnnouncementCard),
            const SizedBox(height: 16),
          ],
          ...regularAnnouncements.map(_buildAnnouncementCard),
        ],
      ),
    );
  }

  Widget _buildAnnouncementCard(dynamic announcement) {
    final isPinned = announcement['isPinned'] == true;
    final DateTime createdAt = DateTime.parse(announcement['createdAt']);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      color: isPinned ? const Color(0xFFFFFBE6) : Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
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
                        announcement['content'],
                        style: const TextStyle(
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Text(
                            'Teacher', // In a real app, this would be the actual name
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            ' • ${DateFormat('MMM d, yyyy').format(createdAt)}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                if (isPinned)
                  Icon(
                    Icons.push_pin,
                    size: 16,
                    color: Colors.amber.shade600,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResourcesTab() {
    final resources = _classroom!['resources'] as List?;

    if (resources == null || resources.isEmpty) {
      return _buildEmptyState(
        icon: Icons.folder,
        title: 'No resources available',
        message: 'Check back later for learning materials',
      );
    }

    // Group resources by type
    final Map<String, List<dynamic>> resourcesByType = {};
    for (final resource in resources) {
      final type = resource['type'];
      if (!resourcesByType.containsKey(type)) {
        resourcesByType[type] = [];
      }
      resourcesByType[type]!.add(resource);
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.folder, color: Color(0xFF49ABB0), size: 18),
              const SizedBox(width: 8),
              const Text(
                'Learning Resources',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Resources by type
          ...resourcesByType.entries.map((entry) {
            final type = entry.key;
            final typeResources = entry.value;

            IconData typeIcon;
            Color typeColor;

            switch (type) {
              case 'Document':
                typeIcon = Icons.insert_drive_file;
                typeColor = Colors.blue;
                break;
              case 'Video':
                typeIcon = Icons.video_library;
                typeColor = Colors.red;
                break;
              case 'Link':
                typeIcon = Icons.link;
                typeColor = Colors.green;
                break;
              case 'Presentation':
                typeIcon = Icons.slideshow;
                typeColor = Colors.amber;
                break;
              default:
                typeIcon = Icons.attachment;
                typeColor = Colors.purple;
                break;
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(typeIcon, color: typeColor, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      '$type Resources',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ...typeResources.map((resource) => _buildResourceItem(
                      resource: resource,
                      icon: typeIcon,
                      color: typeColor,
                    )),
                const SizedBox(height: 16),
              ],
            );
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildResourceItem({
    required dynamic resource,
    required IconData icon,
    required Color color,
  }) {
    final DateTime addedAt = DateTime.parse(resource['addedAt']);

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 16),
        ),
        title: Text(
          resource['title'],
          style: const TextStyle(
            fontWeight: FontWeight.w500,
            fontSize: 14,
          ),
        ),
        subtitle: Text(
          'Added ${DateFormat('MMM d, yyyy').format(addedAt)}',
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
          ),
        ),
        trailing: const Icon(Icons.open_in_new, size: 16),
        onTap: () {
          // Open resource URL
        },
      ),
    );
  }

  Widget _buildStudentsTab() {
    final students = _classroom!['studentsData'] as List?;

    if (students == null || students.isEmpty) {
      return _buildEmptyState(
        icon: Icons.people,
        title: 'No students enrolled',
        message: 'Be the first to join this classroom!',
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.people, color: Color(0xFF6F42C1), size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'Classmates (${students.length})',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.search, size: 14, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(
                      'Find classmate',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Students grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              childAspectRatio: 0.9,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemCount: students.length,
            itemBuilder: (context, index) {
              final student = students[index];
              return Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.grey.shade200,
                        radius: 24,
                        child: Text(
                          student['name'][0],
                          style: TextStyle(
                            color: Colors.grey.shade700,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        student['name'],
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontWeight: FontWeight.w500,
                          fontSize: 12,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Student',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildGradesTab() {
    final grades = _classroom!['gradesData'] as List?;

    if (grades == null || grades.isEmpty) {
      return _buildEmptyState(
        icon: Icons.grading,
        title: 'No grades available',
        message: 'Grades will appear here once assignments are graded',
      );
    }

    final overallGrade = _calculateOverallGrade();
    final gradedItems = grades.where((g) => g['score'] != null).toList();
    final pendingItems = grades.where((g) => g['score'] == null).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Overall Grade',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Based on weighted average of all assessments',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                      _buildGradeDisplay(overallGrade),
                    ],
                  ),
                  const Divider(height: 32),
                  const Text(
                    'Assessments',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Assessments table
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade200),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: [
                        // Table header
                        Container(
                          padding: const EdgeInsets.symmetric(
                              vertical: 8, horizontal: 12),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade50,
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(8),
                              topRight: Radius.circular(8),
                            ),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                flex: 3,
                                child: Text(
                                  'Assessment',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w500,
                                    fontSize: 12,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Text(
                                  'Date',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w500,
                                    fontSize: 12,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Text(
                                  'Weight',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w500,
                                    fontSize: 12,
                                    color: Colors.grey.shade700,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                              Expanded(
                                child: Text(
                                  'Score',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w500,
                                    fontSize: 12,
                                    color: Colors.grey.shade700,
                                  ),
                                  textAlign: TextAlign.right,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Table rows
                        ...grades.map((grade) {
                          final DateTime date = DateTime.parse(grade['date']);
                          final int score = grade['score'] ?? 0;
                          final int maxScore = grade['maxScore'];
                          final int weight = grade['weight'];
                          final bool isGraded = grade['score'] != null;

                          return Container(
                            padding: const EdgeInsets.symmetric(
                                vertical: 10, horizontal: 12),
                            decoration: BoxDecoration(
                              border: Border(
                                top: BorderSide(color: Colors.grey.shade200),
                              ),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  flex: 3,
                                  child: Text(
                                    grade['title'],
                                    style: const TextStyle(fontSize: 13),
                                  ),
                                ),
                                Expanded(
                                  child: Text(
                                    DateFormat('MM/dd').format(date),
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade700,
                                    ),
                                  ),
                                ),
                                Expanded(
                                  child: Text(
                                    '$weight%',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey.shade700,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                                Expanded(
                                  child: isGraded
                                      ? Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.end,
                                          children: [
                                            Container(
                                              width: 36,
                                              height: 4,
                                              decoration: BoxDecoration(
                                                borderRadius:
                                                    BorderRadius.circular(2),
                                                color: _getScoreColor(
                                                    score, maxScore),
                                              ),
                                            ),
                                            const SizedBox(width: 6),
                                            Text(
                                              '$score/$maxScore',
                                              style: const TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w500,
                                              ),
                                              textAlign: TextAlign.right,
                                            ),
                                          ],
                                        )
                                      : Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 2,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.grey.shade100,
                                            borderRadius:
                                                BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            'Pending',
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: Colors.grey.shade700,
                                            ),
                                            textAlign: TextAlign.right,
                                          ),
                                        ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

          // Performance breakdown
          Row(
            children: [
              Expanded(
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Performance Breakdown',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ...gradedItems.map((grade) {
                          final score = grade['score'] as int;
                          final maxScore = grade['maxScore'] as int;
                          final percentage = (score / maxScore * 100).round();

                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      grade['title'],
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  Text(
                                    '$percentage%',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Container(
                                height: 6,
                                width: double.infinity,
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade200,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                                child: FractionallySizedBox(
                                  alignment: Alignment.centerLeft,
                                  widthFactor: score / maxScore,
                                  child: Container(
                                    decoration: BoxDecoration(
                                      color: _getScoreColor(score, maxScore),
                                      borderRadius: BorderRadius.circular(3),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                            ],
                          );
                        }).toList(),
                        if (gradedItems.isEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(vertical: 20),
                            alignment: Alignment.center,
                            child: Text(
                              'No graded assignments yet',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Upcoming Assessments',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ...pendingItems.map((grade) {
                          final DateTime date = DateTime.parse(grade['date']);

                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12.0),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: Colors.blue.shade50,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    Icons.event,
                                    color: Colors.blue.shade400,
                                    size: 14,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        grade['title'],
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w500,
                                          fontSize: 13,
                                        ),
                                      ),
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            DateFormat('MMM d, yyyy')
                                                .format(date),
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey.shade600,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 6,
                                              vertical: 2,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Colors.blue.shade50,
                                              borderRadius:
                                                  BorderRadius.circular(4),
                                            ),
                                            child: Text(
                                              '${grade['weight']}% of grade',
                                              style: TextStyle(
                                                fontSize: 10,
                                                color: Colors.blue.shade700,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                        if (pendingItems.isEmpty)
                          Container(
                            padding: const EdgeInsets.symmetric(vertical: 20),
                            alignment: Alignment.center,
                            child: Text(
                              'No upcoming assessments',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGradeDisplay(String grade) {
    if (grade == 'N/A' || grade == 'Pending') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.grey.shade100,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          grade,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            color: Colors.grey.shade700,
          ),
        ),
      );
    }

    final gradeValue = int.tryParse(grade.replaceAll('%', '')) ?? 0;
    Color gradeColor;

    if (gradeValue >= 90) {
      gradeColor = Colors.green.shade700;
    } else if (gradeValue >= 80) {
      gradeColor = Colors.lightGreen.shade700;
    } else if (gradeValue >= 70) {
      gradeColor = Colors.amber.shade700;
    } else if (gradeValue >= 60) {
      gradeColor = Colors.orange.shade700;
    } else {
      gradeColor = Colors.red.shade700;
    }

    return Text(
      grade,
      style: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.bold,
        color: gradeColor,
      ),
    );
  }

  Color _getScoreColor(int score, int maxScore) {
    final percentage = score / maxScore;

    if (percentage >= 0.9) {
      return Colors.green.shade500;
    } else if (percentage >= 0.8) {
      return Colors.lightGreen.shade500;
    } else if (percentage >= 0.7) {
      return Colors.amber.shade500;
    } else if (percentage >= 0.6) {
      return Colors.orange.shade500;
    } else {
      return Colors.red.shade500;
    }
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String message,
  }) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 60,
              color: Colors.grey.shade300,
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
