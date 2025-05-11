import 'package:flutter/material.dart';
import 'dart:ui';
// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import 'package:shared_preferences/shared_preferences.dart';

class StudentAuthPage extends StatefulWidget {
  const StudentAuthPage({Key? key}) : super(key: key);

  @override
  State<StudentAuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<StudentAuthPage>
    with TickerProviderStateMixin {
  bool isLogin = true;
  int registerStep = 1; // 1: Form, 2: Preferences
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

  // Store registration data between steps
  Map<String, dynamic> _registrationData = {};

  // User preferences
  List<String> _selectedPreferences = [];

  // Define interest categories similar to web implementation
  final List<Map<String, dynamic>> interestCategories = [
    {'id': 'math', 'name': 'Mathematics', 'icon': Icons.calculate},
    {
      'id': 'computer_science',
      'name': 'Computer Science',
      'icon': Icons.computer
    },
    {'id': 'biology', 'name': 'Biology', 'icon': Icons.biotech},
    {'id': 'physics', 'name': 'Physics', 'icon': Icons.science},
    {'id': 'chemistry', 'name': 'Chemistry', 'icon': Icons.science_outlined},
    {'id': 'literature', 'name': 'Literature', 'icon': Icons.book},
    {'id': 'engineering', 'name': 'Engineering', 'icon': Icons.engineering},
    {'id': 'business', 'name': 'Business', 'icon': Icons.business},
    {'id': 'medicine', 'name': 'Medicine', 'icon': Icons.medical_services},
    {'id': 'history', 'name': 'History', 'icon': Icons.history_edu},
    {'id': 'education', 'name': 'Education', 'icon': Icons.school},
    {'id': 'technology', 'name': 'Technology', 'icon': Icons.devices},
  ];

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

  // Method to toggle preference selection
  void _togglePreference(String preferenceId) {
    setState(() {
      if (_selectedPreferences.contains(preferenceId)) {
        _selectedPreferences.remove(preferenceId);
      } else {
        // Limit to maximum 5 selections
        if (_selectedPreferences.length < 5) {
          _selectedPreferences.add(preferenceId);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Maximum 5 interests can be selected.'),
              backgroundColor: Color(0xFF49ABB0),
            ),
          );
        }
      }
    });
  }

  // Method to proceed to next step after form validation
  void _nextStep() {
    if (_formKey.currentState!.validate()) {
      // Store registration data
      _registrationData = {
        "name": _nameController.text,
        "addressline1": _addressLine1Controller.text,
        "addressline2": _addressLine2Controller.text,
        "city": _cityController.text,
        "state": _stateController.text,
        "postalCode": _postalCodeController.text,
        "enrollmentId": _enrollmentIdController.text,
        "dob": _selectedDate == null
            ? ""
            : "${_selectedDate!.year}-${_selectedDate!.month.toString().padLeft(2, '0')}-${_selectedDate!.day.toString().padLeft(2, '0')}",
        "email": _emailController.text,
        "password": _passwordController.text,
      };

      setState(() {
        registerStep = 2;
      });
    }
  }

  // Method to go back to form step
  void _backToForm() {
    setState(() {
      registerStep = 1;
    });
  }

  // Method to skip preferences
  void _skipPreferences() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('You can set your interests later in your profile.'),
        backgroundColor: Color(0xFF49ABB0),
      ),
    );
    _completeRegistration();
  }

  Future<void> studentLogin(String email, String password) async {
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

  // Complete registration with preferences
  Future<void> _completeRegistration() async {
    try {
      // Show loading indicator
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Creating account...'),
          backgroundColor: Color(0xFF49ABB0),
        ),
      );

      // First register the student
      bool registrationSuccess = await registerStudent(
        name: _registrationData["name"],
        addressLine1: _registrationData["addressline1"],
        addressLine2: _registrationData["addressline2"],
        city: _registrationData["city"],
        state: _registrationData["state"],
        postalCode: _registrationData["postalCode"],
        enrollmentId: _registrationData["enrollmentId"],
        dob: _registrationData["dob"],
        email: _registrationData["email"],
        password: _registrationData["password"],
      );

      if (registrationSuccess) {
        // Then save preferences if any are selected
        if (_selectedPreferences.isNotEmpty) {
          print("Saving preferences: $_selectedPreferences");
        }

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Registration successful!'),
            backgroundColor: Colors.green,
          ),
        );

        // Reset the step
        setState(() {
          registerStep = 1;
          isLogin = true;
        });

        // Navigate to home page
        Navigator.pushReplacementNamed(context, '/');
      }
    } catch (error) {
      print("Error: $error");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Registration failed: $error'),
          backgroundColor: Colors.red,
        ),
      );
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
    try {
      // Log the registration data but don't send to server
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
      print("Registration data collected (not sent to server): $requestData");

      // Return success without server validation
      print("Student registered successfully without validation");
      return true;
    } catch (error) {
      print("Registration simulation error: $error");
      return true; // Return true anyway to always succeed
    }
  }

  Future<String> getToken() async {
    return "fake-token-for-testing";
  }

  void checkToken() async {
    print("Using fake token for testing purposes");
  }

  void _toggleAuthMode() {
    setState(() {
      isLogin = !isLogin;
      registerStep = 1; // Reset to first step when switching modes
      _animationController.reset();
      _animationController.forward();
    });
  }

  // Modified submit form to handle multi-step registration
  void _submitForm() {
    if (isLogin) {
      if (_formKey.currentState!.validate()) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Logging in...'),
            backgroundColor: Color(0xFF49ABB0),
          ),
        );
        studentLogin(_emailController.text, _passwordController.text);
      }
    } else {
      if (registerStep == 1) {
        // Proceed to preferences step after form validation
        _nextStep();
      } else {
        // Complete registration with preferences
        if (_selectedPreferences.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please select at least one interest'),
              backgroundColor: Colors.red,
            ),
          );
          return;
        }
        _completeRegistration();
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
                        isLogin
                            ? 'Welcome Back!'
                            : (registerStep == 1
                                ? 'Create Account'
                                : 'Select Your Interests'),
                        style: const TextStyle(
                          fontSize: 20,
                          color: Colors.black,
                        ),
                      ),

                      const SizedBox(height: 40),

                      // Auth form or Preferences UI
                      FadeTransition(
                        opacity: _formAnimation,
                        child: SlideTransition(
                          position: Tween<Offset>(
                            begin: const Offset(0, 0.3),
                            end: Offset.zero,
                          ).animate(_formAnimation),
                          child: !isLogin && registerStep == 2
                              ? _buildPreferencesUI()
                              : _buildAuthForm(),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Toggle button (only show on login or first step of signup)
                      if (isLogin || registerStep == 1)
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

  // New method to build the preferences UI
  Widget _buildPreferencesUI() {
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
      child: Column(
        children: [
          // Back button
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton.icon(
              icon: const Icon(Icons.arrow_back, color: Color(0xFF49ABB0)),
              label: const Text("Back",
                  style: TextStyle(color: Color(0xFF49ABB0))),
              onPressed: _backToForm,
            ),
          ),

          const Text(
            "Select Your Academic Interests",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),

          const SizedBox(height: 8),

          const Text(
            "Choose up to 5 subjects you're interested in",
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
            textAlign: TextAlign.center,
          ),

          const SizedBox(height: 20),

          // Interests grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              childAspectRatio: 0.9,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemCount: interestCategories.length,
            itemBuilder: (context, index) {
              final category = interestCategories[index];
              final isSelected = _selectedPreferences.contains(category['id']);

              return GestureDetector(
                onTap: () => _togglePreference(category['id']),
                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color(0xFF49ABB0).withOpacity(0.1)
                        : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isSelected
                          ? const Color(0xFF49ABB0)
                          : Colors.grey.shade300,
                      width: 2,
                    ),
                  ),
                  child: Stack(
                    children: [
                      // Center the content properly
                      Positioned.fill(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Container(
                              height: 40, // Fixed height for icon
                              width: 40, // Fixed width for icon
                              alignment: Alignment.center,
                              child: Icon(
                                category['icon'],
                                size: 30,
                                color: isSelected
                                    ? const Color(0xFF49ABB0)
                                    : Colors.grey.shade700,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 4.0),
                              child: Text(
                                category['name'],
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: isSelected
                                      ? FontWeight.bold
                                      : FontWeight.normal,
                                  color: isSelected
                                      ? const Color(0xFF49ABB0)
                                      : Colors.black87,
                                ),
                                textAlign: TextAlign.center,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Checkmark indicator
                      if (isSelected)
                        Positioned(
                          top: 5,
                          right: 5,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: Color(0xFF49ABB0),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.check,
                              size: 14,
                              color: Colors.white,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),

          const SizedBox(height: 24),

          // Continue and Skip buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: _selectedPreferences.isEmpty
                      ? null
                      : _completeRegistration,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF49ABB0),
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    elevation: 5,
                  ),
                  child: const Text(
                    'CREATE ACCOUNT',
                    style: TextStyle(
                      color: Color.fromARGB(255, 245, 245, 221),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          TextButton(
            onPressed: _skipPreferences,
            child: const Text(
              "Skip for now",
              style: TextStyle(color: Colors.grey),
            ),
          ),

          const SizedBox(height: 8),

          const Text(
            "These preferences help us personalize your learning experience",
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey,
            ),
            textAlign: TextAlign.center,
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
                    initialDate: _selectedDate ?? DateTime(2000),
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
                      isLogin
                          ? 'LOGIN'
                          : (registerStep == 1 ? 'NEXT' : 'SIGN UP'),
                      style: const TextStyle(
                        color: Color.fromARGB(255, 245, 245, 221),
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
