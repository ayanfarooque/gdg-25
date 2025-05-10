import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import '../components/teacherheader.dart';
import '../components/teacherFooter.dart';
import 'package:percent_indicator/percent_indicator.dart';

class TeacherHomePage extends StatefulWidget {
  const TeacherHomePage({super.key});

  @override
  State<TeacherHomePage> createState() => _TeacherHomePageState();
}

class _TeacherHomePageState extends State<TeacherHomePage>
    with SingleTickerProviderStateMixin {
  int _selectedIndex = 0;
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  List<dynamic> _assignments = [];
  List<dynamic> _pendingAssignments = [];
  String _selectedClass = 'Class A';
  late TabController _tabController;
  final List<String> _classes = ['Class A', 'Class B', 'Class C'];
  bool _isLoading = true;

  // Define the theme colors
  final Color teacherPrimaryColor = const Color(0xFFE195AB);
  final Color backgroundColor = const Color(0xFFF5F5DD);
  final Color accentColor =
      const Color(0xFF8A6FDF); // New accent color for teacher
  final Color textColor = Colors.black87;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadAssignments();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _loadAssignments() async {
    try {
      final String response =
          await rootBundle.loadString('lib/data/assignment.json');
      final data = await json.decode(response);
      setState(() {
        _assignments = data;
        _pendingAssignments = [];
        for (var assignment in _assignments) {
          if (assignment['isCompleted'] == false) {
            _pendingAssignments.add(assignment);
          }
        }
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading assignments: $e');
      // Create mock data for testing if file loading fails
      setState(() {
        _assignments = [
          {
            'id': 'Physics Assignment',
            'dueDate': '2025-05-15T15:30:00Z',
            'isCompleted': false,
          },
          {
            'id': 'Chemistry Lab Report',
            'dueDate': '2025-05-10T23:59:00Z',
            'isCompleted': false,
          },
        ];
        _pendingAssignments = _assignments;
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
        Navigator.pushReplacementNamed(context, '/teacherhome');
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
      case 5:
        Navigator.pushNamed(context, '/teacherclassroom');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: teacherPrimaryColor,
      body: _isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: Colors.white,
              ),
            )
          : SafeArea(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header section
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
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
                        child: SingleChildScrollView(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 24),

                              // Quick Overview Cards
                              _buildQuickOverview(),

                              const SizedBox(height: 24),

                              // Academic Planner
                              _buildAcademicPlanner(),

                              const SizedBox(height: 24),

                              // Tabbed Content
                              _buildTabbedContent(),

                              const SizedBox(height: 24),

                              // Class Performance
                              _buildClassPerformanceSection(),

                              const SizedBox(height: 24),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
      bottomNavigationBar: TeacherFooter(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildQuickOverview() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Dashboard Overview",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildInfoCard(
                  title: "Pending Grading",
                  value: "${_pendingAssignments.length}",
                  icon: Icons.assignment_late,
                  color: Colors.red,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildInfoCard(
                  title: "Today's Classes",
                  value: "3",
                  icon: Icons.class_,
                  color: accentColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildInfoCard(
                  title: "Students",
                  value: "82",
                  icon: Icons.people,
                  color: Colors.blue,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildInfoCard(
                  title: "Avg. Score",
                  value: "78%",
                  icon: Icons.trending_up,
                  color: Colors.green,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 0,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: color,
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAcademicPlanner() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Academic Planner",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  spreadRadius: 0,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: TableCalendar(
                    firstDay: DateTime.utc(2020, 1, 1),
                    lastDay: DateTime.utc(2030, 12, 31),
                    focusedDay: _focusedDay,
                    calendarFormat: _calendarFormat,
                    headerStyle: HeaderStyle(
                      formatButtonVisible: true,
                      titleCentered: true,
                      formatButtonDecoration: BoxDecoration(
                        color: teacherPrimaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      formatButtonTextStyle:
                          TextStyle(color: teacherPrimaryColor),
                      titleTextStyle: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    calendarStyle: CalendarStyle(
                      todayDecoration: BoxDecoration(
                        color: teacherPrimaryColor.withOpacity(0.7),
                        shape: BoxShape.circle,
                      ),
                      selectedDecoration: BoxDecoration(
                        color: teacherPrimaryColor,
                        shape: BoxShape.circle,
                      ),
                      markerDecoration: BoxDecoration(
                        color: accentColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    selectedDayPredicate: (day) {
                      return isSameDay(_selectedDay, day);
                    },
                    onDaySelected: (selectedDay, focusedDay) {
                      setState(() {
                        _selectedDay = selectedDay;
                        _focusedDay = focusedDay;
                      });
                    },
                    onFormatChanged: (format) {
                      if (_calendarFormat != format) {
                        setState(() {
                          _calendarFormat = format;
                        });
                      }
                    },
                    onPageChanged: (focusedDay) {
                      _focusedDay = focusedDay;
                    },
                  ),
                ),
                const Divider(),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildCalendarIndicator(
                        color: teacherPrimaryColor,
                        label: "Class",
                      ),
                      _buildCalendarIndicator(
                        color: Colors.blue,
                        label: "Meeting",
                      ),
                      _buildCalendarIndicator(
                        color: Colors.green,
                        label: "Exam",
                      ),
                      _buildCalendarIndicator(
                        color: Colors.orange,
                        label: "Event",
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCalendarIndicator({
    required Color color,
    required String label,
  }) {
    return Row(
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 6),
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

  Widget _buildTabbedContent() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  spreadRadius: 0,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                TabBar(
                  controller: _tabController,
                  labelColor: teacherPrimaryColor,
                  unselectedLabelColor: Colors.grey,
                  indicatorColor: teacherPrimaryColor,
                  tabs: const [
                    Tab(
                      icon: Icon(Icons.assignment_turned_in),
                      text: "Grading",
                    ),
                    Tab(
                      icon: Icon(Icons.schedule),
                      text: "Schedule",
                    ),
                    Tab(
                      icon: Icon(Icons.people),
                      text: "Students",
                    ),
                  ],
                ),
                SizedBox(
                  height: 300,
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildAssignmentsToGradeTab(),
                      _buildScheduleTab(),
                      _buildStudentsTab(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAssignmentsToGradeTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Pending Assignments",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton.icon(
                onPressed: () {
                  Navigator.pushNamed(context, '/teacherassignment');
                },
                icon: Icon(Icons.add, color: teacherPrimaryColor, size: 18),
                label: Text(
                  "View All",
                  style: TextStyle(color: teacherPrimaryColor),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: _pendingAssignments.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.task_alt,
                          color: teacherPrimaryColor,
                          size: 64,
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          "All caught up!",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "No pending assignments to grade",
                          style: TextStyle(
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: _pendingAssignments.length,
                    itemBuilder: (context, index) {
                      final assignment = _pendingAssignments[index];
                      return _buildAssignmentCard(
                        title: assignment['id'],
                        dueDate: assignment['dueDate'],
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleTab() {
    final List<Map<String, dynamic>> todaySchedule = [
      {
        'time': '09:00 AM',
        'subject': 'Mathematics',
        'class': 'Class A',
        'room': 'Room 101',
      },
      {
        'time': '11:00 AM',
        'subject': 'Physics',
        'class': 'Class B',
        'room': 'Lab 202',
      },
      {
        'time': '02:00 PM',
        'subject': 'Computer Science',
        'class': 'Class A',
        'room': 'Room 303',
      },
    ];

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Today's Schedule - ${DateFormat('EEE, MMM d').format(DateTime.now())}",
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: todaySchedule.length,
              itemBuilder: (context, index) {
                final schedule = todaySchedule[index];
                return _buildScheduleCard(
                  time: schedule['time'],
                  subject: schedule['subject'],
                  classGroup: schedule['class'],
                  room: schedule['room'],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStudentsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                "Class: ",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedClass,
                      isExpanded: true,
                      icon: const Icon(Icons.arrow_drop_down),
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
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView(
              children: [
                _studentPerformanceTile("Arun Kumar", "A+", 93),
                _studentPerformanceTile("Priya Singh", "A", 87),
                _studentPerformanceTile("Rahul Sharma", "B+", 80),
                _studentPerformanceTile("Neha Patel", "A+", 100),
                _studentPerformanceTile("Arjun Verma", "B", 73),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAssignmentCard({
    required String title,
    required String dueDate,
  }) {
    final DateTime parsedDate = DateTime.parse(dueDate);
    final bool isUrgent = parsedDate.difference(DateTime.now()).inDays < 3;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isUrgent ? Colors.red.withOpacity(0.5) : Colors.grey.shade200,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 6,
            spreadRadius: 0,
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(
          "Due: ${DateFormat('MMM d, yyyy').format(parsedDate)}",
          style: TextStyle(
            fontSize: 12,
            color: isUrgent ? Colors.red : Colors.grey[600],
          ),
        ),
        trailing: ElevatedButton(
          onPressed: () {
            // Navigate to grade this assignment
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: teacherPrimaryColor,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: const Text("Grade"),
        ),
      ),
    );
  }

  Widget _buildScheduleCard({
    required String time,
    required String subject,
    required String classGroup,
    required String room,
  }) {
    bool isCurrentClass = false;
    // Check if this is the current class based on time
    final now = TimeOfDay.now();
    final classTime = TimeOfDay(
      hour: int.parse(time.split(':')[0]),
      minute: int.parse(time.split(':')[1].split(' ')[0]),
    );

    if (now.hour == classTime.hour) {
      isCurrentClass = true;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isCurrentClass ? teacherPrimaryColor : Colors.grey.shade200,
          width: isCurrentClass ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 6,
            spreadRadius: 0,
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: teacherPrimaryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Text(
                time.split(' ')[0],
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: teacherPrimaryColor,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    subject,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "$classGroup · $room",
                    style: TextStyle(
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            if (isCurrentClass)
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: teacherPrimaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  "NOW",
                  style: TextStyle(
                    color: teacherPrimaryColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _studentPerformanceTile(String name, String grade, int scorePercent) {
    Color gradeColor;

    switch (grade) {
      case 'A+':
        gradeColor = Colors.green[700]!;
        break;
      case 'A':
        gradeColor = Colors.green;
        break;
      case 'B+':
        gradeColor = Colors.blue[700]!;
        break;
      case 'B':
        gradeColor = Colors.blue;
        break;
      default:
        gradeColor = Colors.orange;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 6,
            spreadRadius: 0,
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: teacherPrimaryColor.withOpacity(0.1),
          child: Text(
            name[0],
            style: TextStyle(
              color: teacherPrimaryColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          name,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: LinearPercentIndicator(
          lineHeight: 8.0,
          percent: scorePercent / 100,
          backgroundColor: Colors.grey.shade200,
          progressColor: gradeColor,
          barRadius: const Radius.circular(8),
          padding: const EdgeInsets.only(top: 8),
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: gradeColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            grade,
            style: TextStyle(
              color: gradeColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildClassPerformanceSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Class Performance",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  spreadRadius: 0,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                // Class selection
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedClass,
                      isExpanded: true,
                      icon: const Icon(Icons.arrow_drop_down),
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
                const SizedBox(height: 24),

                // Class stats
                Row(
                  children: [
                    Expanded(
                      child: _buildStatColumn("Average Score", "76%"),
                    ),
                    Expanded(
                      child: _buildStatColumn("Attendance Rate", "92%"),
                    ),
                    Expanded(
                      child: _buildStatColumn("Pass Rate", "89%"),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Performance by subject
                const Text(
                  "Performance by Subject",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                _buildSubjectPerformance("Mathematics", 0.82, Colors.blue),
                const SizedBox(height: 12),
                _buildSubjectPerformance("Science", 0.76, Colors.green),
                const SizedBox(height: 12),
                _buildSubjectPerformance("English", 0.68, Colors.orange),
                const SizedBox(height: 12),
                _buildSubjectPerformance("History", 0.73, Colors.purple),

                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/teacherscores');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: teacherPrimaryColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    minimumSize: const Size(double.infinity, 0),
                  ),
                  child: const Text("VIEW DETAILED REPORTS"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatColumn(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 24,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildSubjectPerformance(String subject, double percent, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              subject,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              "${(percent * 100).toInt()}%",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        LinearPercentIndicator(
          lineHeight: 10.0,
          percent: percent,
          backgroundColor: Colors.grey.shade200,
          progressColor: color,
          barRadius: const Radius.circular(8),
          padding: EdgeInsets.zero,
        ),
      ],
    );
  }
}
