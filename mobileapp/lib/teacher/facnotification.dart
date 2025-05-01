import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';
import '../components/teacherheader.dart';
import '../components/footer.dart';

class FacNotifications extends StatefulWidget {
  final String studentId;

  FacNotifications({required this.studentId});

  @override
  State<FacNotifications> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<FacNotifications> {
  int _selectedIndex = 0;
  List<dynamic> _notifications = [];

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    try {
      // Load the JSON file from the existing location
      final String jsonData =
          await rootBundle.loadString('lib/data/notification.json');

      // Parse the JSON data
      final List<dynamic> notificationsData = json.decode(jsonData);

      // Filter notifications for this specific student if studentId is provided
      // Otherwise show all notifications
      if (widget.studentId.isNotEmpty) {
        setState(() {
          _notifications = notificationsData
              .where((notification) =>
                  notification['studentId'] == widget.studentId)
              .toList();
        });
      } else {
        setState(() {
          _notifications = notificationsData;
        });
      }

      // Sort notifications by time (newest first)
      _notifications.sort((a, b) => DateTime.parse(b['notificationTime'])
          .compareTo(DateTime.parse(a['notificationTime'])));
    } catch (e) {
      print("Error loading notifications from local file: $e");

      // Fallback data in case the file cannot be loaded
      setState(() {
        _notifications = [
          {
            "notificationId": "error",
            "notificationContent":
                "Unable to load notifications. Please try again later.",
            "notificationTime": DateTime.now().toIso8601String()
          }
        ];
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
        Navigator.pushNamed(context, '/teacherhome');
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
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE195AB),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: TeacherHeader(
                  onProfileTap: () {
                    Navigator.pushNamed(context, '/teacherprofile');
                  },
                  onNotificationTap: () {
                    Navigator.pushNamed(context, '/teachernotifications');
                  },
                  profileImage: 'assets/images/teacher.png',
                  welcomeText: "WELCOME ",
                ),
              ),
              const SizedBox(height: 10),
              Container(
                margin: const EdgeInsets.fromLTRB(0.0, 30.0, 0.0, 0.0),
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 15),
                    ..._notifications.map((notification) {
                      return _buildNotificationTile(
                        notification['notificationTime'],
                        notification['notificationContent'],
                      );
                    }).toList(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildNotificationTile(String date, String content) {
    final DateTime parsedDate = DateTime.parse(date);
    final String formattedDate =
        DateFormat('dd MMM yyyy, hh:mm a').format(parsedDate);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: const Color.fromARGB(255, 236, 231, 202),
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              spreadRadius: 2,
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              content,
              style: const TextStyle(
                fontWeight: FontWeight.normal,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.bottomRight,
              child: Text(
                formattedDate,
                style: const TextStyle(
                  fontWeight: FontWeight.normal,
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
