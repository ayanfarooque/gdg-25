import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:intl/intl.dart';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../components/constants.dart';

class FacCreateAssignment extends StatefulWidget {
  @override
  _FacCreateAssignmentState createState() => _FacCreateAssignmentState();
}

class _FacCreateAssignmentState extends State<FacCreateAssignment> {
  // Form key for validation
  final _formKey = GlobalKey<FormState>();

  // Controllers for text fields
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _instructionsController = TextEditingController();
  final _pointsController = TextEditingController(text: "100");

  // Assignment details
  String _assignmentType = "Assignment"; // default
  String _selectedSubject = "Math"; // default
  DateTime _dueDate =
      DateTime.now().add(Duration(days: 7)); // default to 1 week from now
  TimeOfDay _dueTime = TimeOfDay(hour: 23, minute: 59); // default to end of day
  List<PlatformFile> _attachedFiles = [];
  bool _isSubmitting = false;
  String? _error;

  // Subject options
  final List<String> _subjects = [
    "Math",
    "Science",
    "History",
    "English",
    "Art",
    "Music",
    "Physical Education",
    "Computer Science",
    "Foreign Language",
    "Other"
  ];

  // Colors for PINK UI theme
  final Color primaryColor = Color(0xFFE195AB); // Pink primary color
  final Color accentColor = Color(0xFFF06292); // Darker pink accent color
  final Color backgroundColor = Color(0xFFFCE4EC); // Light pink background
  final Color cardColor = Colors.white;
  final Color textColor = Color(0xFF4A4A4A);
  final Color secondaryTextColor = Color(0xFF757575);

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _instructionsController.dispose();
    _pointsController.dispose();
    super.dispose();
  }

  // Rest of your code remains unchanged...
  Future<void> _pickFiles() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.any,
        allowMultiple: true,
      );

      if (result != null) {
        setState(() {
          _attachedFiles.addAll(result.files);
        });
      }
    } catch (e) {
      print('Error picking files: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error selecting files. Please try again.')),
      );
    }
  }

  // ... other methods remain the same...
  void _removeFile(int index) {
    setState(() {
      _attachedFiles.removeAt(index);
    });
  }

  Future<void> _selectDueDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _dueDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(Duration(days: 365)),
      builder: (BuildContext context, Widget? child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: ColorScheme.light(
              primary: primaryColor,
              // Add more pink theme elements
              onPrimary: Colors.white,
              surface: cardColor,
              onSurface: textColor,
            ),
            dialogBackgroundColor: cardColor,
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _dueDate = DateTime(
          picked.year,
          picked.month,
          picked.day,
          _dueTime.hour,
          _dueTime.minute,
        );
      });

      // Also select time
      await _selectDueTime();
    }
  }

  Future<void> _selectDueTime() async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _dueTime,
      builder: (BuildContext context, Widget? child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: ColorScheme.light(
              primary: primaryColor,
              // Add more pink theme elements
              onPrimary: Colors.white,
              surface: cardColor,
              onSurface: textColor,
            ),
            dialogBackgroundColor: cardColor,
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _dueTime = picked;
        _dueDate = DateTime(
          _dueDate.year,
          _dueDate.month,
          _dueDate.day,
          picked.hour,
          picked.minute,
        );
      });
    }
  }

  // Submit function (unchanged)
  Future<void> _submitAssignment() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isSubmitting = true;
      _error = null;
    });

    try {
      // Same implementation as before...
      final Map<String, dynamic> assignmentData = {
        'title': _titleController.text,
        'description': _descriptionController.text,
        'subject': _selectedSubject,
        'dueDate': _dueDate.toIso8601String(),
        'status': 'published',
        'instructions': _instructionsController.text,
        'points': int.parse(_pointsController.text),
        'assignmentType': _assignmentType,
        'teacher': 'teacherId123',
        'classroom': 'classroomId123',
      };

      List<Map<String, dynamic>> attachments = [];
      for (var file in _attachedFiles) {
        attachments.add({
          'name': file.name,
          'type': file.extension ?? 'unknown',
          'size': '${(file.size / 1024).toStringAsFixed(2)} KB',
          'url': 'placeholder-url',
        });
      }
      assignmentData['attachments'] = attachments;

      await Future.delayed(Duration(seconds: 2));

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Assignment created successfully!'),
          backgroundColor: primaryColor,
        ),
      );

      Navigator.pop(context, true);
    } catch (e) {
      setState(() {
        _error = 'Failed to create assignment. Please try again.';
      });
      print('Error submitting assignment: $e');
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Create Assignment',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: primaryColor,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.white),
      ),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: Container(
          color: backgroundColor,
          child: Form(
            key: _formKey,
            child: ListView(
              padding: EdgeInsets.all(16),
              children: [
                // Assignment type selector
                Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Assignment Type',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: textColor,
                          ),
                        ),
                        SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _buildAssignmentTypeChip(
                                'Assignment', Icons.assignment),
                            _buildAssignmentTypeChip('Quiz', Icons.quiz),
                            _buildAssignmentTypeChip('Exam', Icons.timer),
                            _buildAssignmentTypeChip('Project', Icons.build),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                SizedBox(height: 16),

                // Basic details card - unchanged structure but with updated themes
                Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Assignment Details',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: textColor,
                          ),
                        ),
                        SizedBox(height: 16),

                        // Title field
                        TextFormField(
                          controller: _titleController,
                          decoration: InputDecoration(
                            labelText: 'Title *',
                            labelStyle:
                                TextStyle(color: primaryColor.withOpacity(0.8)),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide:
                                  BorderSide(color: primaryColor, width: 2),
                            ),
                            prefixIcon: Icon(Icons.title, color: primaryColor),
                          ),
                          validator: (value) {
                            if (value == null || value.trim().isEmpty) {
                              return 'Please enter a title';
                            }
                            return null;
                          },
                        ),

                        SizedBox(height: 16),

                        // Description field
                        TextFormField(
                          controller: _descriptionController,
                          decoration: InputDecoration(
                            labelText: 'Description',
                            labelStyle:
                                TextStyle(color: primaryColor.withOpacity(0.8)),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide:
                                  BorderSide(color: primaryColor, width: 2),
                            ),
                            prefixIcon:
                                Icon(Icons.description, color: primaryColor),
                          ),
                          maxLines: 3,
                        ),

                        SizedBox(height: 16),

                        // Subject dropdown
                        DropdownButtonFormField<String>(
                          value: _selectedSubject,
                          decoration: InputDecoration(
                            labelText: 'Subject *',
                            labelStyle:
                                TextStyle(color: primaryColor.withOpacity(0.8)),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide:
                                  BorderSide(color: primaryColor, width: 2),
                            ),
                            prefixIcon:
                                Icon(Icons.subject, color: primaryColor),
                          ),
                          dropdownColor: Colors.white,
                          items: _subjects.map((String subject) {
                            return DropdownMenuItem<String>(
                              value: subject,
                              child: Text(subject),
                            );
                          }).toList(),
                          onChanged: (String? newValue) {
                            setState(() {
                              _selectedSubject = newValue!;
                            });
                          },
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please select a subject';
                            }
                            return null;
                          },
                          icon:
                              Icon(Icons.arrow_drop_down, color: primaryColor),
                        ),

                        SizedBox(height: 16),

                        // Due date and time selector
                        InkWell(
                          onTap: _selectDueDate,
                          child: InputDecorator(
                            decoration: InputDecoration(
                              labelText: 'Due Date & Time *',
                              labelStyle: TextStyle(
                                  color: primaryColor.withOpacity(0.8)),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide:
                                    BorderSide(color: primaryColor, width: 2),
                              ),
                              prefixIcon: Icon(Icons.calendar_today,
                                  color: primaryColor),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  DateFormat('MMM dd, yyyy - hh:mm a')
                                      .format(_dueDate),
                                  style: TextStyle(color: textColor),
                                ),
                                Icon(Icons.arrow_drop_down,
                                    color: primaryColor),
                              ],
                            ),
                          ),
                        ),

                        SizedBox(height: 16),

                        // Points field
                        TextFormField(
                          controller: _pointsController,
                          decoration: InputDecoration(
                            labelText: 'Points *',
                            labelStyle:
                                TextStyle(color: primaryColor.withOpacity(0.8)),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide:
                                  BorderSide(color: primaryColor, width: 2),
                            ),
                            prefixIcon: Icon(Icons.star, color: primaryColor),
                          ),
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter points';
                            }
                            try {
                              int points = int.parse(value);
                              if (points < 0 || points > 1000) {
                                return 'Points must be between 0 and 1000';
                              }
                            } catch (e) {
                              return 'Please enter a valid number';
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                ),

                SizedBox(height: 16),

                // Instructions card
                Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Instructions',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: textColor,
                          ),
                        ),
                        SizedBox(height: 16),
                        TextFormField(
                          controller: _instructionsController,
                          decoration: InputDecoration(
                            hintText:
                                'Enter detailed instructions for students...',
                            hintStyle: TextStyle(
                                color: secondaryTextColor.withOpacity(0.6)),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide:
                                  BorderSide(color: primaryColor, width: 2),
                            ),
                          ),
                          maxLines: 6,
                        ),
                      ],
                    ),
                  ),
                ),

                SizedBox(height: 16),

                // Attachments card
                Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Attachments',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: textColor,
                          ),
                        ),
                        SizedBox(height: 16),

                        // File upload button
                        OutlinedButton.icon(
                          onPressed: _pickFiles,
                          icon: Icon(Icons.attach_file),
                          label: Text('Add Files'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: primaryColor,
                            side: BorderSide(color: primaryColor),
                            padding: EdgeInsets.symmetric(
                                vertical: 12, horizontal: 16),
                          ),
                        ),

                        SizedBox(height: 16),

                        // Attached files list
                        if (_attachedFiles.isEmpty)
                          Center(
                            child: Text(
                              'No files attached',
                              style: TextStyle(color: secondaryTextColor),
                            ),
                          )
                        else
                          ListView.builder(
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            itemCount: _attachedFiles.length,
                            itemBuilder: (context, index) {
                              final file = _attachedFiles[index];
                              return ListTile(
                                leading:
                                    _getFileIconByType(file.extension ?? ''),
                                title: Text(
                                  file.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(color: textColor),
                                ),
                                subtitle: Text(
                                  '${(file.size / 1024).toStringAsFixed(2)} KB',
                                  style: TextStyle(color: secondaryTextColor),
                                ),
                                trailing: IconButton(
                                  icon: Icon(Icons.delete, color: accentColor),
                                  onPressed: () => _removeFile(index),
                                ),
                              );
                            },
                          ),
                      ],
                    ),
                  ),
                ),

                SizedBox(height: 24),

                // Error message if any
                if (_error != null)
                  Container(
                    padding: EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.red.shade200),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.error, color: Colors.red),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _error!,
                            style: TextStyle(color: Colors.red.shade800),
                          ),
                        ),
                      ],
                    ),
                  ),

                SizedBox(height: 24),

                // Submit button
                ElevatedButton(
                  onPressed: _isSubmitting ? null : _submitAssignment,
                  child: _isSubmitting
                      ? Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            ),
                            SizedBox(width: 12),
                            Text('Creating Assignment...'),
                          ],
                        )
                      : Text(
                          'CREATE ASSIGNMENT',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: accentColor,
                    foregroundColor: Colors.white,
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    elevation: 3,
                    shadowColor: accentColor.withOpacity(0.5),
                  ),
                ),

                SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAssignmentTypeChip(String type, IconData icon) {
    final isSelected = _assignmentType == type;

    return ChoiceChip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 18,
            color: isSelected ? Colors.white : primaryColor,
          ),
          SizedBox(width: 8),
          Text(type),
        ],
      ),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _assignmentType = type;
          });
        }
      },
      backgroundColor: Colors.pink.shade50,
      selectedColor: primaryColor,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : primaryColor,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
    );
  }

  Widget _getFileIconByType(String extension) {
    extension = extension.toLowerCase();

    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].contains(extension)) {
      return Icon(Icons.image, color: primaryColor);
    }
    // PDF
    else if (extension == 'pdf') {
      return Icon(Icons.picture_as_pdf, color: accentColor);
    }
    // Documents
    else if (['doc', 'docx', 'txt', 'rtf'].contains(extension)) {
      return Icon(Icons.description, color: primaryColor);
    }
    // Spreadsheets
    else if (['xls', 'xlsx', 'csv'].contains(extension)) {
      return Icon(Icons.table_chart, color: primaryColor);
    }
    // Presentations
    else if (['ppt', 'pptx'].contains(extension)) {
      return Icon(Icons.slideshow, color: accentColor);
    }
    // Archives
    else if (['zip', 'rar', '7z', 'tar', 'gz'].contains(extension)) {
      return Icon(Icons.folder_zip, color: primaryColor);
    }
    // Default
    else {
      return Icon(Icons.insert_drive_file, color: accentColor);
    }
  }
}
