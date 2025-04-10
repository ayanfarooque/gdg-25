import 'package:flutter/material.dart';
import 'dart:convert';
//import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';
import '../components/teacherheader.dart';
import '../components/footer.dart';
import 'package:http/http.dart' as http;

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

  void _loadNotifications() async {
    final String apiUrl =
        "http://192.168.0.104:5000/api/notify/all-notifications";

    try {
      final response = await http.get(Uri.parse(apiUrl));

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        if (responseData["success"]) {
          setState(() {
            _notifications = responseData["notifications"];
          });
        } else {
          print("Error: ${responseData['message']}");
        }
      } else {
        print("Failed to load notifications: ${response.statusCode}");
      }
    } catch (e) {
      print("Error fetching notifications: $e");
    }
  }

  // Future<void> createNotification(String content) async {
  //   final String apiUrl = "http://10.0.0.5:5000/api/notify/create-notification";
  //   final response = await http.post(
  //     Uri.parse(apiUrl),
  //     headers: {"Content-Type": "application/json"},
  //     body: jsonEncode({
  //       "studentId": widget.studentId,
  //       "content": content,
  //     }),
  //   );

  //   if (response.statusCode == 201) {
  //     _loadNotifications(); // Refresh list after adding
  //   } else {
  //     print("Failed to create notification");
  //   }
  // }

  // Future<void> deleteNotification(String notificationId) async {
  //   final String apiUrl =
  //       "http://10.0.0.5:5000/api/notify/delete/$notificationId";
  //   final response = await http.delete(Uri.parse(apiUrl));

  //   if (response.statusCode == 200) {
  //     _loadNotifications(); // Refresh list after deletion
  //   } else {
  //     print("Failed to delete notification");
  //   }
  // }

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
                  welcomeText: "WELCOME HASHIM",
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
