import 'package:dummyapp/teacher/facnotification.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'student/home.dart';
import 'student/assignment.dart';
import 'student/aibot.dart';
import 'student/resources/landing.dart';
import 'student/community.dart';
import 'student/score.dart';
import 'student/profile.dart';
import 'student/notification.dart';
import 'authorization/studentsisu.dart';
import 'authorization/rolepicker.dart';
import 'authorization/teachersisu.dart';
import 'teacher/home.dart';
import 'teacher/teacherprofile.dart';
import 'teacher/teacherai.dart';
import 'teacher/faccommunity.dart';
import 'teacher/facassignment.dart';
import 'teacher/facresources/faclanding.dart';
import 'teacher/addassignment.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Default to not logged in
  bool isLoggedIn = false;

  try {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    // Only set to true if token exists and is not empty
    isLoggedIn = token != null && token.isNotEmpty;
    print("Token found: $isLoggedIn");
  } catch (e) {
    print("Error checking login status: $e");
    // Keep isLoggedIn as false on error
  }

  runApp(MyApp(isLoggedIn: isLoggedIn));
}

class MyApp extends StatelessWidget {
  final bool isLoggedIn;

  const MyApp({super.key, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Multi-Page App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'CustomFont',
        textTheme: TextTheme(
          bodyLarge: TextStyle(
              fontFamily: 'CustomFont',
              fontSize: 18,
              fontWeight: FontWeight.w100),
          bodyMedium: TextStyle(
              fontFamily: 'CustomFont',
              fontSize: 16,
              fontWeight: FontWeight.w100),
          bodySmall: TextStyle(
              fontFamily: 'CustomFont',
              fontSize: 14,
              fontWeight: FontWeight.w100),
        ),
      ),
      initialRoute: isLoggedIn ? '/role' : '/role',
      routes: {
        '/role': (context) => RolePickerScreen(),
        '/': (context) => const HomePage(),
        '/addassignment': (context) => AddAssignmentPage(),
        '/teachernotifications': (context) =>
            FacNotifications(studentId: '603dcd7f1c4ae72f8c8b4571'),
        '/teacherassignment': (context) => FacAssignmentLanding(),
        '/teacherresources': (context) => FacResourceLanding(),
        '/teacherai': (context) => TeacherAi(),
        '/teacherprofile': (context) => TeacherProfilePage(),
        '/teacherhome': (context) => const TeacherHomePage(),
        '/teachercommunity': (context) => FacCommunityLanding(),
        '/teacherauth': (context) => const TeacherAuthPage(),
        '/studentauth': (context) => const StudentAuthPage(),
        '/assignment': (context) => AssignmentLanding(),
        '/aibot': (context) => AiLanding(),
        '/resources': (context) => ResourceLanding(),
        '/community': (context) => CommunityLanding(),
        '/viewscore': (context) => ViewScores(),
        '/profile': (context) => Profile(studentId: '1'),
        '/notifications': (context) =>
            ViewNotifications(studentId: '603dcd7f1c4ae72f8c8b4571'),
      },
      onGenerateRoute: (settings) {
        // If user is not logged in, redirect all routes except /auth to the auth page
        if (!isLoggedIn && settings.name != '/auth') {
          return MaterialPageRoute(
            builder: (context) => const StudentAuthPage(),
          );
        }
        return null; // Let the routes above handle the navigation
      },
    );
  }
}
