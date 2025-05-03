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
import 'student/communityadd.dart';
import 'authorization/adminsisu.dart';
import 'student/classroom.dart';
import 'student/ClassroomDetailScreen.dart';
import 'student/createpostpage.dart';
import 'teacher/create_post.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Always set to true for testing purposes
  bool isLoggedIn = true; // Changed to always be true

  // Store a dummy token for testing
  try {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', 'dummy-test-token');
    print("Test token set: isLoggedIn=$isLoggedIn");
  } catch (e) {
    print("Error setting test token: $e");
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
      initialRoute: '/role', // Always start at role picker for testing
      routes: {
        '/role': (context) => RolePickerScreen(),
        '/': (context) => const HomePage(),
        '/studentauth': (context) => const StudentAuthPage(),
        '/assignment': (context) => AssignmentLanding(),
        '/aibot': (context) => AiLanding(),
        '/resources': (context) => ResourceLanding(),
        '/community': (context) => CommunityLanding(),
        '/addcommunity': (context) => AddCommunityQuestionPage(),
        '/viewscore': (context) => ViewScores(),
        '/profile': (context) => Profile(studentId: '1'),
        '/notifications': (context) =>
            ViewNotifications(studentId: '603dcd7f1c4ae72f8c8b4571'),
        '/classroom': (context) => ClassroomLanding(),
        '/classroom_detail': (context) {
          final args = ModalRoute.of(context)?.settings.arguments
              as Map<String, dynamic>?;
          return ClassroomDetailScreen(
            classroomId: args?['classroomId'] ?? '',
          );
        },
        '/createpost': (context) => CreatePostPage(),
        '/adminauth': (context) => const AdminAuthPage(),
        '/addassignment': (context) => AddAssignmentPage(),
        '/teachernotifications': (context) =>
            FacNotifications(studentId: '603dcd7f1c4ae72f8c8b4571'),
        '/teacherassignment': (context) => FacClassroomsLanding(),
        '/teacherresources': (context) => FacResourceLanding(),
        '/teacherai': (context) => TeacherAi(),
        '/teacherprofile': (context) => TeacherProfilePage(),
        '/teacherhome': (context) => const TeacherHomePage(),
        '/teachercommunity': (context) => FacCommunityLanding(),
        '/teacherauth': (context) => const TeacherAuthPage(),
        '/teachercreatepost': (context) => FacCreatePostPage(),
      },
      // Bypass auth check completely by removing onGenerateRoute override
      // This ensures all routes work without authentication
    );
  }
}
