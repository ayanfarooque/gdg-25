import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:math' as math;
import 'package:animated_text_kit/animated_text_kit.dart';

class RolePickerScreen extends StatefulWidget {
  const RolePickerScreen({Key? key}) : super(key: key);

  @override
  State<RolePickerScreen> createState() => _RolePickerScreenState();
}

class _RolePickerScreenState extends State<RolePickerScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _rotationAnimation;
  bool _isHoveringStudent = false;
  bool _isHoveringTeacher = false;
  bool _isHoveringAdmin = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(seconds: 30),
      vsync: this,
    )..repeat();

    _rotationAnimation =
        Tween<double>(begin: 0, end: 2 * math.pi).animate(_animationController);
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _selectRole(BuildContext context, String role) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_role', role);

      // Navigate based on selected role
      if (role == 'student') {
        Navigator.pushReplacementNamed(context, '/studentauth');
      } else if (role == 'teacher') {
        Navigator.pushReplacementNamed(context, '/teacherauth');
      } else if (role == 'admin') {
        // You'll need to create an admin auth page and route
        Navigator.pushReplacementNamed(context, '/adminauth');
        // If admin route doesn't exist yet, you can use this fallback:
        // ScaffoldMessenger.of(context).showSnackBar(
        //   SnackBar(content: Text('Admin login coming soon')),
        // );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error setting role: $e')),
      );
    }
  }

  @override
  // Modified build method for _RolePickerScreenState
  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;

    return Scaffold(
      body: Stack(
        children: [
          // Background gradient
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  const Color(0xFF49ABB0), // Teal
                  const Color(0xFFECE7CA), // Light cream
                ],
              ),
            ),
          ),

          // Animated background patterns
          AnimatedBuilder(
            animation: _rotationAnimation,
            builder: (context, child) {
              return CustomPaint(
                painter: BackgroundPatternPainter(_rotationAnimation.value),
                size: Size.infinite,
              );
            },
          ),

          // Content
          SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    SizedBox(height: size.height * 0.05),

                    // Animated title
                    Center(
                      child: AnimatedTextKit(
                        animatedTexts: [
                          TypewriterAnimatedText(
                            'Welcome',
                            textStyle: const TextStyle(
                              fontSize: 40.0,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              shadows: [
                                Shadow(
                                  blurRadius: 10.0,
                                  color: Colors.black26,
                                  offset: Offset(5.0, 5.0),
                                ),
                              ],
                            ),
                            speed: const Duration(milliseconds: 200),
                          ),
                        ],
                        totalRepeatCount: 1,
                        displayFullTextOnTap: true,
                      ),
                    ),

                    const SizedBox(height: 10),
                    Center(
                      child: Text(
                        "Choose your role to continue",
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                          shadows: [
                            Shadow(
                              blurRadius: 5.0,
                              color: Colors.black.withOpacity(0.3),
                              offset: const Offset(2.0, 2.0),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 30),

                    // VERTICAL CARDS - Student Card
                    GestureDetector(
                      onTap: () => _selectRole(context, 'student'),
                      onTapDown: (_) =>
                          setState(() => _isHoveringStudent = true),
                      onTapUp: (_) =>
                          setState(() => _isHoveringStudent = false),
                      onTapCancel: () =>
                          setState(() => _isHoveringStudent = false),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                        margin: EdgeInsets.symmetric(
                            vertical: 10,
                            horizontal: _isHoveringStudent ? 10 : 20),
                        height: 160,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF49ABB0)
                                  .withOpacity(_isHoveringStudent ? 0.8 : 0.4),
                              blurRadius: _isHoveringStudent ? 20 : 10,
                              spreadRadius: _isHoveringStudent ? 5 : 1,
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            SizedBox(width: 20),
                            // Student image
                            Container(
                              height: 100,
                              width: 100,
                              decoration: BoxDecoration(
                                color: const Color(0xFF49ABB0).withOpacity(0.2),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: Image.asset(
                                  'lib/images/image3.png',
                                  height: 80,
                                  width: 80,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Icon(
                                      Icons.school,
                                      size: 40,
                                      color: const Color(0xFF49ABB0),
                                    );
                                  },
                                ),
                              ),
                            ),
                            SizedBox(width: 20),
                            Expanded(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Student",
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFF49ABB0),
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                    "Access your classes, assignments, and track your progress",
                                    style: TextStyle(
                                      color: Colors.black54,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(width: 20),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 15),

                    // Teacher Card
                    GestureDetector(
                      onTap: () => _selectRole(context, 'teacher'),
                      onTapDown: (_) =>
                          setState(() => _isHoveringTeacher = true),
                      onTapUp: (_) =>
                          setState(() => _isHoveringTeacher = false),
                      onTapCancel: () =>
                          setState(() => _isHoveringTeacher = false),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                        margin: EdgeInsets.symmetric(
                            vertical: 10,
                            horizontal: _isHoveringTeacher ? 10 : 20),
                        height: 160,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFE195AB)
                                  .withOpacity(_isHoveringTeacher ? 0.8 : 0.4),
                              blurRadius: _isHoveringTeacher ? 20 : 10,
                              spreadRadius: _isHoveringTeacher ? 5 : 1,
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            SizedBox(width: 20),
                            // Teacher image
                            Container(
                              height: 100,
                              width: 100,
                              decoration: BoxDecoration(
                                color: const Color(0xFFE195AB).withOpacity(0.2),
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: Image.asset(
                                  'lib/images/teacher.png',
                                  height: 80,
                                  width: 80,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Icon(
                                      Icons.person,
                                      size: 40,
                                      color: const Color(0xFFE195AB),
                                    );
                                  },
                                ),
                              ),
                            ),
                            SizedBox(width: 20),
                            Expanded(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Teacher",
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFFE195AB),
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                    "Manage classes, create assignments, and track student progress",
                                    style: TextStyle(
                                      color: Colors.black54,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(width: 20),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 15),
                    SizedBox(height: size.height * 0.05),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Custom painter for animated background patterns
class BackgroundPatternPainter extends CustomPainter {
  final double rotation;

  BackgroundPatternPainter(this.rotation);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    final centerX = size.width / 2;
    final centerY = size.height / 2;
    final maxRadius = math.sqrt(centerX * centerX + centerY * centerY);
    final maxCircles = 20;

    // Draw rotating circles
    for (int i = 1; i <= maxCircles; i++) {
      final radius = i * maxRadius / maxCircles;
      canvas.save();
      canvas.translate(centerX, centerY);
      canvas.rotate(rotation * (i % 2 == 0 ? 1 : -1) / 10);
      canvas.drawCircle(Offset.zero, radius, paint);
      canvas.restore();
    }

    // Draw diagonal lines
    final linePaint = Paint()
      ..color = Colors.white.withOpacity(0.05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    for (double i = -size.width; i < size.width; i += 50) {
      canvas.save();
      canvas.translate(centerX, centerY);
      canvas.rotate(rotation / 20);
      canvas.drawLine(Offset(i, -size.height),
          Offset(i + size.height, size.height), linePaint);
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(BackgroundPatternPainter oldDelegate) =>
      oldDelegate.rotation != rotation;
}
