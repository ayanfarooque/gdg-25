import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../components/teacherheader.dart';

class AddAssignmentPage extends StatefulWidget {
  const AddAssignmentPage({Key? key}) : super(key: key);

  @override
  _AddAssignmentPageState createState() => _AddAssignmentPageState();
}

class _AddAssignmentPageState extends State<AddAssignmentPage> {
  final _formKey = GlobalKey<FormState>();
  final _assignmentNameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _totalMarksController = TextEditingController();
  
  DateTime? _startDate;
  DateTime? _endDate;
  String? _selectedClass;
  String? _selectedSubject;
  
  final List<String> _classes = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  final List<String> _subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];

  bool _isSubmitting = false;
  
  @override
  void dispose() {
    _assignmentNameController.dispose();
    _descriptionController.dispose();
    _totalMarksController.dispose();
    super.dispose();
  }

  Future<void> _submitAssignment() async {
    if (_formKey.currentState!.validate()) {
      if (_startDate == null || _endDate == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please select both start and end dates'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }
      
      if (_selectedClass == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please select a class'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }
      
      if (_selectedSubject == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please select a subject'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      setState(() {
        _isSubmitting = true;
      });

      // Create assignment data structure
      final assignment = {
        'title': _assignmentNameController.text,
        'description': _descriptionController.text,
        'class': _selectedClass,
        'subject': _selectedSubject,
        'totalMarks': int.parse(_totalMarksController.text),
        'startDate': DateFormat('yyyy-MM-dd').format(_startDate!),
        'dueDate': DateFormat('yyyy-MM-dd').format(_endDate!),
      };

      try {
        // In a real app, you'd send this to your backend
        // final response = await http.post(
        //   Uri.parse('https://your-api.com/assignments'),
        //   headers: {'Content-Type': 'application/json'},
        //   body: json.encode(assignment),
        // );
        
        // Simulate API call with a delay
        await Future.delayed(const Duration(seconds: 2));
        
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Assignment created successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        
        // Navigate back or clear form
        _resetForm();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to create assignment: $e'),
            backgroundColor: Colors.red,
          ),
        );
      } finally {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }
  
  void _resetForm() {
    setState(() {
      _assignmentNameController.clear();
      _descriptionController.clear();
      _totalMarksController.clear();
      _startDate = null;
      _endDate = null;
      _selectedClass = null;
      _selectedSubject = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE195AB), // Teacher color theme
      body: SingleChildScrollView(
        child: Column(
          children: [
            TeacherHeader(
              onProfileTap: () {
                Navigator.pushNamed(context, '/teacher/profile');
              },
              onNotificationTap: () {
                Navigator.pushNamed(context, '/teacher/notifications');
              },
              profileImage: 'lib/images/teacher.png',
              welcomeText: "CREATE ASSIGNMENT",
            ),
            Container(
              margin: const EdgeInsets.fromLTRB(0, 20, 0, 0),
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Color.fromARGB(255, 245, 245, 221),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Assignment Details",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 25),
                    
                    // Assignment Name Field
                    TextFormField(
                      controller: _assignmentNameController,
                      decoration: _inputDecoration(
                        "Assignment Name",
                        Icons.assignment,
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter assignment name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    
                    // Description Field
                    TextFormField(
                      controller: _descriptionController,
                      decoration: _inputDecoration(
                        "Description",
                        Icons.description,
                      ),
                      maxLines: 3,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a description';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    
                    // Class Dropdown
                    DropdownButtonFormField<String>(
                      decoration: _inputDecoration(
                        "Select Class",
                        Icons.class_,
                      ),
                      value: _selectedClass,
                      items: _classes.map((String class_) {
                        return DropdownMenuItem(
                          value: class_,
                          child: Text(class_),
                        );
                      }).toList(),
                      onChanged: (String? newValue) {
                        setState(() {
                          _selectedClass = newValue;
                        });
                      },
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please select a class';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    
                    // Subject Dropdown
                    DropdownButtonFormField<String>(
                      decoration: _inputDecoration(
                        "Select Subject",
                        Icons.subject,
                      ),
                      value: _selectedSubject,
                      items: _subjects.map((String subject) {
                        return DropdownMenuItem(
                          value: subject,
                          child: Text(subject),
                        );
                      }).toList(),
                      onChanged: (String? newValue) {
                        setState(() {
                          _selectedSubject = newValue;
                        });
                      },
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please select a subject';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    
                    // Total Marks Field
                    TextFormField(
                      controller: _totalMarksController,
                      decoration: _inputDecoration(
                        "Total Marks",
                        Icons.score,
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter total marks';
                        }
                        if (int.tryParse(value) == null) {
                          return 'Please enter a valid number';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    
                    // Start Date Field
                    InkWell(
                      onTap: () async {
                        final DateTime? picked = await showDatePicker(
                          context: context,
                          initialDate: _startDate ?? DateTime.now(),
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 365)),
                          builder: (context, child) {
                            return Theme(
                              data: ThemeData.light().copyWith(
                                colorScheme: const ColorScheme.light(
                                  primary: Color(0xFFE195AB),
                                ),
                              ),
                              child: child!,
                            );
                          },
                        );
                        if (picked != null) {
                          setState(() {
                            _startDate = picked;
                            // If end date is before new start date, reset it
                            if (_endDate != null && _endDate!.isBefore(_startDate!)) {
                              _endDate = null;
                            }
                          });
                        }
                      },
                      child: InputDecorator(
                        decoration: _inputDecoration(
                          "Start Date",
                          Icons.calendar_today,
                        ),
                        child: Text(
                          _startDate == null
                              ? 'Select Start Date'
                              : DateFormat('dd MMM yyyy').format(_startDate!),
                          style: TextStyle(
                            color: _startDate == null ? Colors.grey : Colors.black,
                          ),
                        ),
                      ),
                    ),
                    if (_startDate == null)
                      const Padding(
                        padding: EdgeInsets.only(left: 12, top: 8),
                        child: Text(
                          'Please select a start date',
                          style: TextStyle(
                            color: Colors.red,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    const SizedBox(height: 20),
                    
                    // End Date Field
                    InkWell(
                      onTap: () async {
                        if (_startDate == null) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Please select start date first'),
                              backgroundColor: Colors.red,
                            ),
                          );
                          return;
                        }
                        final DateTime? picked = await showDatePicker(
                          context: context,
                          initialDate: _endDate ?? _startDate!.add(const Duration(days: 7)),
                          firstDate: _startDate!,
                          lastDate: _startDate!.add(const Duration(days: 365)),
                          builder: (context, child) {
                            return Theme(
                              data: ThemeData.light().copyWith(
                                colorScheme: const ColorScheme.light(
                                  primary: Color(0xFFE195AB),
                                ),
                              ),
                              child: child!,
                            );
                          },
                        );
                        if (picked != null) {
                          setState(() {
                            _endDate = picked;
                          });
                        }
                      },
                      child: InputDecorator(
                        decoration: _inputDecoration(
                          "End Date (Due Date)",
                          Icons.event_available,
                        ),
                        child: Text(
                          _endDate == null
                              ? 'Select End Date'
                              : DateFormat('dd MMM yyyy').format(_endDate!),
                          style: TextStyle(
                            color: _endDate == null ? Colors.grey : Colors.black,
                          ),
                        ),
                      ),
                    ),
                    if (_endDate == null)
                      const Padding(
                        padding: EdgeInsets.only(left: 12, top: 8),
                        child: Text(
                          'Please select an end date',
                          style: TextStyle(
                            color: Colors.red,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    const SizedBox(height: 30),
                    
                    // Submit Button
                    Center(
                      child: SizedBox(
                        width: 220,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: _isSubmitting ? null : _submitAssignment,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFE195AB),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                            elevation: 5,
                          ),
                          child: _isSubmitting
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Text(
                                  'CREATE ASSIGNMENT',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 50),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, color: const Color(0xFFE195AB)),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide.none,
      ),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Color(0xFFE195AB), width: 2),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.red),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.red, width: 2),
      ),
    );
  }
}