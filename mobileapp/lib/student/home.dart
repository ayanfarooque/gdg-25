import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:fl_chart/fl_chart.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import '../components/header.dart';
import '../components/footer.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  List<dynamic> _assignments = [];
  List<dynamic> _pendingAssignments = [];

  @override
  void initState() {
    super.initState();
    _loadAssignments();
  }

  void _loadAssignments() async {
    final String response =
        await rootBundle.loadString('lib/data/assignment.json');
    final data = await json.decode(response);
    setState(() {
      _assignments = data;
      _pendingAssignments = _assignments
          .where((assignment) => assignment['isCompleted'] == false)
          .toList();
      print(_pendingAssignments); // Debug print to verify data
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    // Navigate to different pages based on index
    switch (index) {
      case 0:
        Navigator.pushNamed(context, '/');
        break;
      case 1:
        Navigator.pushNamed(context, '/assignment');
        break;
      case 2:
        Navigator.pushNamed(context, '/community');
        break;
      case 3:
        Navigator.pushNamed(context, '/aibot');
        break;
      case 4:
        Navigator.pushNamed(context, '/resources');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          const Color.fromARGB(255, 73, 171, 176), // Background color
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(0.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Header(
                  onProfileTap: () {
                    Navigator.pushNamed(context, '/profile');
                  },
                  onNotificationTap: () {
                    Navigator.pushNamed(context, '/notifications');
                  },
                  profileImage: 'lib/images/image3.png',
                  welcomeText: "WELCOME HASHIM",
                ),
              ),
              const SizedBox(height: 10),
              // Main box
              Container(
                margin: const EdgeInsets.fromLTRB(0.0, 30.0, 0.0, 0.0),
                padding: const EdgeInsets.all(14.0),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 245, 245, 221),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Column(
                  children: [
                    const SizedBox(height: 15),
                    // Calendar
                    Container(
                      margin: const EdgeInsets.all(8.0),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF49ABB0),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        children: [
                          const Text(
                            "PLANNER",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: TableCalendar(
                              firstDay: DateTime.utc(2020, 1, 1),
                              lastDay: DateTime.utc(2030, 12, 31),
                              focusedDay: _focusedDay,
                              calendarFormat: _calendarFormat,
                              selectedDayPredicate: (day) {
                                return isSameDay(_selectedDay, day);
                              },
                              onDaySelected: (selectedDay, focusedDay) {
                                setState(() {
                                  _selectedDay = selectedDay;
                                  _focusedDay =
                                      focusedDay; // update `_focusedDay` here as well
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
                        ],
                      ),
                    ),
                    // Pending assignments
                    Container(
                      margin: const EdgeInsets.all(8.0),
                      padding:
                          const EdgeInsets.fromLTRB(12.0, 20.0, 12.0, 10.0),
                      decoration: BoxDecoration(
                        color: const Color(0xFF49ABB0),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "PENDING ASSIGNMENTS",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w100,
                              color: Colors.black,
                            ),
                          ),
                          ListView.builder(
                            shrinkWrap: true,
                            itemCount: _pendingAssignments.length,
                            itemBuilder: (context, index) {
                              final assignment = _pendingAssignments[index];
                              return _assignmentTile(
                                  assignment['id'], assignment['dueDate']);
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/assignment');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF49ABB0),
                        elevation: 8,
                        shadowColor: Colors.black,
                      ),
                      child: const Text("SUBMIT",
                          style: TextStyle(color: Colors.white)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              // Personal Analytics
              Container(
                padding: EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 245, 245, 221),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color.fromARGB(255, 245, 245, 221),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "PERSONAL ANALYTICS",
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 40),
                      SizedBox(height: 100, child: _buildLineChart()),
                      const SizedBox(height: 40),
                      SizedBox(height: 180, child: _buildPieChart()),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 10),
              // Test Scores
              Container(
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 245, 245, 221),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "TEST SCORES",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w100,
                        color: Colors.black,
                      ),
                    ),
                    _scoreTile(
                        "22/01/25", "SSTUT01", "SST", "Vikul J Pawar", "12/15"),
                    _scoreTile(
                        "24/01/25", "SCIUT01", "SCI", "Sol C Sharma", "15/15"),
                    _scoreTile(
                        "25/01/25", "HINUT01", "HIN", "Vinit Pandey", "14/15"),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/viewscore');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF49ABB0),
                        elevation: 8,
                        shadowColor: Colors.black,
                      ),
                      child: const Text("VIEW ALL",
                          style: TextStyle(color: Colors.white)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      // Bottom Navigation Bar
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _assignmentTile(String title, String dueDate) {
    final DateTime parsedDate = DateTime.parse(dueDate);
    final String formattedDate =
        DateFormat('dd MMM yyyy, hh:mm a').format(parsedDate);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: const Color(0xFFEF5350),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title,
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold)),
            Text(formattedDate, style: const TextStyle(color: Colors.white)),
          ],
        ),
      ),
    );
  }

  Widget _scoreTile(
      String date, String id, String subject, String teacher, String marks) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              spreadRadius: 2,
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(date, style: const TextStyle(fontWeight: FontWeight.normal)),
            Text(id),
            Text(subject),
            Text(marks, style: const TextStyle(fontWeight: FontWeight.normal)),
          ],
        ),
      ),
    );
  }

  Widget _buildLineChart() {
    return LineChart(
      LineChartData(
        titlesData: FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        gridData: FlGridData(show: true),
        lineBarsData: [
          LineChartBarData(
            spots: [FlSpot(0, 40), FlSpot(1, 50), FlSpot(2, 55), FlSpot(3, 60)],
            isCurved: true,
            color: Colors.redAccent,
            barWidth: 3,
          ),
        ],
      ),
    );
  }

  Widget _buildPieChart() {
    return PieChart(
      PieChartData(
        centerSpaceRadius: 40,
        sections: [
          PieChartSectionData(value: 25, color: Colors.red),
          PieChartSectionData(value: 30, color: Colors.blue),
          PieChartSectionData(value: 20, color: Colors.green),
          PieChartSectionData(value: 25, color: Colors.yellow),
        ],
      ),
    );
  }
}
