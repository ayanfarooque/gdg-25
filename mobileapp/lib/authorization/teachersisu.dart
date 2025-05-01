import 'package:flutter/material.dart';
import 'dart:ui';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class TeacherAuthPage extends StatefulWidget {
  const TeacherAuthPage({Key? key}) : super(key: key);

  @override
  State<TeacherAuthPage> createState() => _TeacherAuthPageState();
}

class _TeacherAuthPageState extends State<TeacherAuthPage>
    with TickerProviderStateMixin {
  bool isLogin = true;
  late AnimationController _animationController;
  late Animation<double> _formAnimation;
  late Animation<double> _loginButtonAnimation;
  late Animation<double> _registerButtonAnimation;

  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _employeeIdController = TextEditingController();
  final TextEditingController _addressLine1Controller = TextEditingController();
  final TextEditingController _addressLine2Controller = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _stateController = TextEditingController();
  final TextEditingController _postalCodeController = TextEditingController();
  final TextEditingController _subjectController = TextEditingController();
  final TextEditingController _qualificationController =
      TextEditingController();
  DateTime? _selectedDate;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _formAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.8, curve: Curves.easeOutCubic),
      ),
    );

    _loginButtonAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.5, 1.0, curve: Curves.easeOutCubic),
      ),
    );

    _registerButtonAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.7, 1.0, curve: Curves.easeOutCubic),
      ),
    );

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    _employeeIdController.dispose();
    _addressLine1Controller.dispose();
    _addressLine2Controller.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _postalCodeController.dispose();
    _subjectController.dispose();
    _qualificationController.dispose();
    super.dispose();
  }

  Future<void> teacherLogin(String email, String password) async {
    try {
      // Simulate successful login without server validation
      print("Login successful without validation");

      // Navigate to home page directly without token verification
      Navigator.pushReplacementNamed(context, '/');

      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Logged in successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (error) {
      print("Error: $error");
    }
  }

  Future<bool> registerTeacher({
    required String name,
    required String addressLine1,
    required String addressLine2,
    required String city,
    required String state,
    required String postalCode,
    required String employeeId,
    required String dob,
    required String email,
    required String password,
    required String subject,
    required String qualification,
  }) async {
    try {
      // Log the registration data but don't send to server
      final requestData = {
        "name": name,
        "addressline1": addressLine1,
        "addressline2": addressLine2,
        "city": city,
        "state": state,
        "postalCode": postalCode,
        "enrollmentId": employeeId,
        "dob": dob,
        "email": email,
        "password": password,
      };
      print("Registration data collected (not sent to server): $requestData");

      // Return success without server validation
      print("Student registered successfully without validation");
      return true;
    } catch (error) {
      print("Registration simulation error: $error");
      return true; // Return true anyway to always succeed
    }
  }

  Future<String?> getToken() async {
    return "fake-token-for-testing";
  }

  void checkToken() async {
    print("Using fake token for testing purposes");
  }

  void _toggleAuthMode() {
    setState(() {
      isLogin = !isLogin;
      _animationController.reset();
      _animationController.forward();
    });
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(isLogin ? 'Logging in...' : 'Signing up...'),
          backgroundColor: const Color(0xFFE195AB),
        ),
      );

      // Simplified dummy authentication logic
      if (isLogin) {
        // Always navigate to teacher home regardless of credentials
        Future.delayed(const Duration(seconds: 1), () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Logged in successfully!'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pushReplacementNamed(context, '/teacherhome');
        });
      } else {
        // For signup, also navigate to teacher home after a delay
        if (_selectedDate == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please select your date of birth'),
              backgroundColor: Colors.red,
            ),
          );
          return;
        }

        // Show success message and navigate
        Future.delayed(const Duration(seconds: 1), () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Registration successful!'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pushReplacementNamed(context, '/teacherhome');
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE195AB), // Teacher color theme
      body: Stack(
        children: [
          // Background decoration
          Positioned.fill(
            child: CustomPaint(
              painter: TeacherBackgroundPainter(),
            ),
          ),

          // Content
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Logo and welcome text
                      Hero(
                        tag: 'logo',
                        child: Image.asset(
                          'lib/assets/images/nastavnik_logo.png', // Add your logo image
                          height: 120,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(Icons.school,
                                  size: 100, color: Colors.black),
                        ),
                      ),

                      const SizedBox(height: 20),

                      Text(
                        'NASTAVNIK',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                          letterSpacing: 2,
                          shadows: [
                            Shadow(
                              offset: const Offset(1, 1),
                              blurRadius: 3,
                              color: Colors.black.withOpacity(0.3),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 10),

                      Text(
                        isLogin ? 'Teacher Login' : 'Register as Teacher',
                        style: const TextStyle(
                          fontSize: 20,
                          color: Colors.black,
                        ),
                      ),

                      const SizedBox(height: 40),

                      // Auth form
                      FadeTransition(
                        opacity: _formAnimation,
                        child: SlideTransition(
                          position: Tween<Offset>(
                            begin: const Offset(0, 0.3),
                            end: Offset.zero,
                          ).animate(_formAnimation),
                          child: _buildAuthForm(),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Toggle button
                      FadeTransition(
                        opacity: _registerButtonAnimation,
                        child: TextButton(
                          onPressed: _toggleAuthMode,
                          child: Text(
                            isLogin
                                ? 'Don\'t have an account? Sign Up'
                                : 'Already have an account? Log In',
                            style: const TextStyle(color: Colors.black),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAuthForm() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.9),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            // Name field (only for signup)
            if (!isLogin)
              TextFormField(
                controller: _nameController,
                decoration: _inputDecoration(
                  'Full Name',
                  Icons.person,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your name';
                  }
                  return null;
                },
              ),

            if (!isLogin) const SizedBox(height: 15),

            // Add Employee ID field
            if (!isLogin)
              TextFormField(
                controller: _employeeIdController,
                decoration: _inputDecoration(
                  'Employee ID',
                  Icons.badge,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your employee ID';
                  }
                  return null;
                },
              ),

            if (!isLogin) const SizedBox(height: 15),

            // Add Subject field
            if (!isLogin)
              TextFormField(
                controller: _subjectController,
                decoration: _inputDecoration(
                  'Subject',
                  Icons.subject,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your subject';
                  }
                  return null;
                },
              ),

            if (!isLogin) const SizedBox(height: 15),

            // Add Qualification field
            if (!isLogin)
              TextFormField(
                controller: _qualificationController,
                decoration: _inputDecoration(
                  'Qualification',
                  Icons.school,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your qualification';
                  }
                  return null;
                },
              ),

            if (!isLogin) const SizedBox(height: 15),

            // Email field
            TextFormField(
              controller: _emailController,
              decoration: _inputDecoration(
                'Email Address',
                Icons.email,
              ),
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your email';
                }
                if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                    .hasMatch(value)) {
                  return 'Please enter a valid email';
                }
                return null;
              },
            ),

            const SizedBox(height: 15),

            // Password field
            TextFormField(
              controller: _passwordController,
              decoration: _inputDecoration(
                'Password',
                Icons.lock,
                isPassword: true,
              ),
              obscureText: true,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your password';
                }
                if (!isLogin && value.length < 6) {
                  return 'Password must be at least 6 characters';
                }
                return null;
              },
            ),

            const SizedBox(height: 30),

            // Date of Birth field with date picker
            if (!isLogin)
              TextFormField(
                decoration: _inputDecoration(
                  'Date of Birth',
                  Icons.calendar_today,
                ),
                readOnly:
                    true, // Make the field read-only to prevent keyboard from appearing
                controller: TextEditingController(
                    text: _selectedDate == null
                        ? ''
                        : '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'),
                onTap: () async {
                  // Show date picker when the field is tapped
                  final DateTime? pickedDate = await showDatePicker(
                    context: context,
                    initialDate: _selectedDate ??
                        DateTime(1980), // Default to year 1980 for teachers
                    firstDate: DateTime(1950),
                    lastDate: DateTime.now(),
                    builder: (context, child) {
                      return Theme(
                        data: ThemeData.light().copyWith(
                          primaryColor: const Color(0xFFE195AB),
                          colorScheme: const ColorScheme.light(
                            primary: Color(0xFFE195AB),
                            onPrimary: Colors.white,
                            surface: Colors.white,
                            onSurface: Colors.black,
                          ),
                          buttonTheme: const ButtonThemeData(
                            textTheme: ButtonTextTheme.primary,
                          ),
                        ),
                        child: child!,
                      );
                    },
                  );

                  if (pickedDate != null && pickedDate != _selectedDate) {
                    setState(() {
                      _selectedDate = pickedDate;
                    });
                  }
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select your date of birth';
                  }
                  return null;
                },
              ),

            if (!isLogin) const SizedBox(height: 30),

            // Add Address Line 1
            if (!isLogin)
              TextFormField(
                controller: _addressLine1Controller,
                decoration: _inputDecoration(
                  'Address Line 1',
                  Icons.home,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your address';
                  }
                  return null;
                },
              ),

            if (!isLogin) const SizedBox(height: 15),

            // Add Address Line 2 (optional)
            if (!isLogin)
              TextFormField(
                controller: _addressLine2Controller,
                decoration: _inputDecoration(
                  'Address Line 2 (Optional)',
                  Icons.home_work,
                ),
              ),

            if (!isLogin) const SizedBox(height: 15),

            // Add City
            if (!isLogin)
              TextFormField(
                controller: _cityController,
                decoration: _inputDecoration(
                  'City',
                  Icons.location_city,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your city';
                  }
                  return null;
                },
              ),

            if (!isLogin) const SizedBox(height: 15),

            // Add State
            if (!isLogin)
              TextFormField(
                controller: _stateController,
                decoration: _inputDecoration(
                  'State',
                  Icons.map,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your state';
                  }
                  return null;
                },
              ),

            if (!isLogin) const SizedBox(height: 15),

            // Add Postal Code
            if (!isLogin)
              TextFormField(
                controller: _postalCodeController,
                decoration: _inputDecoration(
                  'Postal Code',
                  Icons.markunread_mailbox,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your postal code';
                  }
                  return null;
                },
              ),

            if (!isLogin) const SizedBox(height: 15),

            // Submit button
            FadeTransition(
              opacity: _loginButtonAnimation,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0, 0.5),
                  end: Offset.zero,
                ).animate(_loginButtonAnimation),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _submitForm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE195AB), // Teacher color
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      elevation: 5,
                    ),
                    child: Text(
                      isLogin ? 'LOGIN' : 'SIGN UP',
                      style: const TextStyle(
                        color: const Color.fromARGB(255, 245, 245, 221),
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon,
      {bool isPassword = false}) {
    return InputDecoration(
      labelText: label,
      labelStyle: TextStyle(
        color: Colors.grey[600],
        fontWeight: FontWeight.w500,
      ),
      prefixIcon: Icon(
        icon,
        color: const Color(0xFFE195AB), // Teacher color
      ),
      suffixIcon: isPassword
          ? IconButton(
              icon: Icon(
                Icons.visibility,
                color: Colors.grey[600],
              ),
              onPressed: () {
                // Toggle password visibility
              },
            )
          : null,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(
          color: Colors.grey[300]!,
          width: 1.0,
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(
          color: Color(0xFFE195AB), // Teacher color
          width: 2.0,
        ),
      ),
      filled: true,
      fillColor: Colors.grey[100],
      contentPadding: const EdgeInsets.symmetric(vertical: 16.0),
    );
  }
}

// Custom background painter for teacher page with teacher color theme
class TeacherBackgroundPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color.fromARGB(255, 245, 245, 221)
      ..style = PaintingStyle.fill;

    final path = Path();

    // Top wave
    path.moveTo(0, 0);
    path.lineTo(size.width, 0);
    path.lineTo(size.width, size.height * 0.25);

    path.quadraticBezierTo(
      size.width * 0.75,
      size.height * 0.35,
      size.width * 0.5,
      size.height * 0.25,
    );

    path.quadraticBezierTo(
      size.width * 0.25,
      size.height * 0.15,
      0,
      size.height * 0.3,
    );

    path.close();
    canvas.drawPath(path, paint);

    // Bottom wave
    final bottomPath = Path();
    bottomPath.moveTo(0, size.height);
    bottomPath.lineTo(size.width, size.height);
    bottomPath.lineTo(size.width, size.height * 0.7);

    bottomPath.quadraticBezierTo(
      size.width * 0.8,
      size.height * 0.8,
      size.width * 0.5,
      size.height * 0.75,
    );

    bottomPath.quadraticBezierTo(
      size.width * 0.2,
      size.height * 0.7,
      0,
      size.height * 0.8,
    );

    bottomPath.close();
    canvas.drawPath(bottomPath, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
