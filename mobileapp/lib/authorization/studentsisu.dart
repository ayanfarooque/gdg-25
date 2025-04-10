import 'package:flutter/material.dart';
import 'dart:ui';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class StudentAuthPage extends StatefulWidget {
  const StudentAuthPage({Key? key}) : super(key: key);

  @override
  State<StudentAuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<StudentAuthPage> with TickerProviderStateMixin {
  bool isLogin = true;
  late AnimationController _animationController;
  late Animation<double> _formAnimation;
  late Animation<double> _loginButtonAnimation;
  late Animation<double> _registerButtonAnimation;

  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _enrollmentIdController = TextEditingController();
  final TextEditingController _addressLine1Controller = TextEditingController();
  final TextEditingController _addressLine2Controller = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _stateController = TextEditingController();
  final TextEditingController _postalCodeController = TextEditingController();
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
    _enrollmentIdController.dispose();
    _addressLine1Controller.dispose();
    _addressLine2Controller.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _postalCodeController.dispose();
    super.dispose();
  }

  Future<void> studentLogin(String email, String password) async {
    final url = Uri.parse(
        "http://192.168.0.104:5000/api/students/login"); // Replace with your backend URL

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token'];

        // Save token in local storage
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', token);

        print("Login successful. Token saved.");
      } else {
        print("Login failed: ${jsonDecode(response.body)['message']}");
      }
    } catch (error) {
      print("Error: $error");
    }
  }

  Future<bool> registerStudent({
    required String name,
    required String addressLine1,
    required String addressLine2,
    required String city,
    required String state,
    required String postalCode,
    required String enrollmentId,
    required String dob,
    required String email,
    required String password,
  }) async {
    final url = Uri.parse('http://10.0.0.2:5000/api/students/register');

    // Log the request data for debugging
    final requestData = {
      "name": name,
      "addressline1": addressLine1,
      "addressline2": addressLine2,
      "city": city,
      "state": state,
      "postalCode": postalCode,
      "enrollmentId": enrollmentId,
      "dob": dob,
      "email": email,
      "password": password,
    };
    print("Sending registration data: $requestData");

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(requestData),
      );

      print("Registration response status: ${response.statusCode}");
      print("Registration response body: ${response.body}");

      if (response.statusCode == 201 || response.statusCode == 200) {
        // Accept either 201 Created or 200 OK
        try {
          final responseData = jsonDecode(response.body);

          // Check if token exists in the response
          if (responseData.containsKey("token")) {
            String token = responseData["token"];

            // Save token in SharedPreferences
            SharedPreferences prefs = await SharedPreferences.getInstance();
            await prefs.setString('auth_token', token);

            print("Student Registered Successfully! Token: $token");
            return true; // Return success
          } else {
            // Successfully registered but no token in response
            print("Registration successful but no token returned");
            return true;
          }
        } catch (e) {
          print("Error parsing response: $e");
          return false;
        }
      } else {
        // Try to parse the error message if possible
        try {
          final responseData = jsonDecode(response.body);
          print(
              "Registration error: ${responseData['message'] ?? 'Unknown error'}");
        } catch (e) {
          print("Registration failed with status ${response.statusCode}");
        }
        return false; // Return failure
      }
    } catch (error) {
      print("Failed to register: $error");
      return false; // Return failure on exception
    }
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  void checkToken() async {
    String? token = await getToken();
    if (token != null) {
      print("Stored Token: $token");
    } else {
      print("No token found");
    }
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
          backgroundColor: const Color(0xFF49ABB0),
        ),
      );

      if (isLogin) {
        // Call the login function when in login mode
        studentLogin(_emailController.text, _passwordController.text).then((_) {
          getToken().then((token) {
            if (token != null) {
              Navigator.pushReplacementNamed(context, '/');
            } else {
              // Login failed, show error
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Login failed. Please check your credentials.'),
                  backgroundColor: Colors.red,
                ),
              );
            }
          });
        });
      } else {
        // Handle registration
        if (_selectedDate == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please select your date of birth'),
              backgroundColor: Colors.red,
            ),
          );
          return;
        }

        // Format date in the required format (YYYY-MM-DD)
        final formattedDob =
            "${_selectedDate!.year}-${_selectedDate!.month.toString().padLeft(2, '0')}-${_selectedDate!.day.toString().padLeft(2, '0')}";

        registerStudent(
          name: _nameController.text,
          addressLine1: _addressLine1Controller.text,
          addressLine2: _addressLine2Controller.text,
          city: _cityController.text,
          state: _stateController.text,
          postalCode: _postalCodeController.text,
          enrollmentId: _enrollmentIdController.text,
          dob: formattedDob,
          email: _emailController.text,
          password: _passwordController.text,
        ).then((success) {
          if (success) {
            // Registration successful
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Registration successful!'),
                backgroundColor: Colors.green,
              ),
            );
            // Navigate to home page
            Navigator.pushReplacementNamed(context, '/');
          } else {
            // Registration failed
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Registration failed. Please try again.'),
                backgroundColor: Colors.red,
              ),
            );
          }
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF49ABB0),
      body: Stack(
        children: [
          // Background decoration
          Positioned.fill(
            child: CustomPaint(
              painter: BackgroundPainter(),
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
                        isLogin ? 'Welcome Back!' : 'Create Account',
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

            // Add Enrollment ID field
            if (!isLogin)
              TextFormField(
                controller: _enrollmentIdController,
                decoration: _inputDecoration(
                  'Enrollment ID',
                  Icons.badge,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your enrollment ID';
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
                        DateTime(2000), // Default to year 2000 if not selected
                    firstDate: DateTime(1950),
                    lastDate: DateTime.now(),
                    builder: (context, child) {
                      return Theme(
                        data: ThemeData.light().copyWith(
                          primaryColor: const Color(0xFF49ABB0),
                          colorScheme: const ColorScheme.light(
                            primary: Color(0xFF49ABB0),
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
                      backgroundColor: const Color(0xFF49ABB0),
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
        color: const Color(0xFF49ABB0),
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
          color: Color(0xFF49ABB0),
          width: 2.0,
        ),
      ),
      filled: true,
      fillColor: Colors.grey[100],
      contentPadding: const EdgeInsets.symmetric(vertical: 16.0),
    );
  }
}

// Custom background painter
class BackgroundPainter extends CustomPainter {
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
