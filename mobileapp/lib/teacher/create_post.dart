import 'package:flutter/material.dart';
import '../components/teacherheader.dart';
import '../components/footer.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class FacCreatePostPage extends StatefulWidget {
  final String? initialCommunity;
  
  const FacCreatePostPage({Key? key, this.initialCommunity}) : super(key: key);

  @override
  State<FacCreatePostPage> createState() => _FacCreatePostPageState();
}

class _FacCreatePostPageState extends State<FacCreatePostPage> {
  int _selectedIndex = 2; // Community tab
  
  // Form controllers
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();
  final TextEditingController _attachmentController = TextEditingController();
  
  // Form values
  String? _selectedCommunity;
  String? _attachmentType;
  bool _isPinnedToTop = false; // Teacher-specific option
  bool _isFeatured = false; // Teacher-specific option
  bool _sendNotification = false; // Teacher-specific option

  // Theme colors for teacher
  final Color teacherPrimaryColor = const Color(0xFFE195AB); // Pink shade for teacher
  final Color backgroundColor = const Color(0xFFF5F5DD);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = const Color(0xFF49ABB0);
  
  List<dynamic> _communities = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCommunities();
    
    // Set initial community if provided
    if (widget.initialCommunity != null) {
      _selectedCommunity = widget.initialCommunity;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    _attachmentController.dispose();
    super.dispose();
  }

  Future<void> _loadCommunities() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Load community data from the JSON file
      final String response = await rootBundle.loadString('lib/data/community.json');
      final data = json.decode(response);
      
      setState(() {
        _communities = data['communities'] ?? [];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading community data: $e');
      setState(() {
        // Add some mock data if JSON loading fails
        _communities = [
          {
            "_id": "1",
            "name": "Physics Educators",
          },
          {
            "_id": "2",
            "name": "Math Teaching Strategies",
          },
          {
            "_id": "3",
            "name": "Computer Science Faculty",
          },
          {
            "_id": "4",
            "name": "Literature Teachers",
          }
        ];
        _isLoading = false;
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
        Navigator.pushReplacementNamed(context, '/teacherhome');
        break;
      case 1:
        Navigator.pushReplacementNamed(context, '/teacherassignment');
        break;
      case 2:
        Navigator.pushReplacementNamed(context, '/teachercommunity');
        break;
      case 3:
        Navigator.pushNamed(context, '/teacherai');
        break;
      case 4:
        Navigator.pushNamed(context, '/teacherresources');
        break;
    }
  }

  void _setAttachmentType(String? type) {
    setState(() {
      if (_attachmentType == type) {
        _attachmentType = null; // Toggle off if already selected
      } else {
        _attachmentType = type;
      }
      
      // Clear attachment URL when changing types
      if (_attachmentType == null) {
        _attachmentController.clear();
      }
    });
  }

  void _handleSubmit() {
    // Validate required fields
    if (_titleController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a title for your post')),
      );
      return;
    }
    
    if (_contentController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter content for your post')),
      );
      return;
    }
    
    if (_selectedCommunity == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a community')),
      );
      return;
    }
    
    // Here you would typically make an API call to create the post
    // For this example, we'll just show a success message and navigate back
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_sendNotification 
          ? 'Post created and notification sent to students!' 
          : 'Post created successfully!'
        ),
        backgroundColor: teacherPrimaryColor,
      ),
    );
    
    // Navigate back to the community page
    Navigator.pushReplacementNamed(context, '/teachercommunity');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: teacherPrimaryColor,
      appBar: AppBar(
        backgroundColor: teacherPrimaryColor,
        elevation: 0,
        title: const Text(
          'Create Post',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            Navigator.pushReplacementNamed(context, '/teachercommunity');
          },
        ),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: Colors.white))
          : SafeArea(
              child: Column(
                children: [
                  // Header section
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: TeacherHeader(
                      onProfileTap: () {
                        Navigator.pushNamed(context, '/teacherprofile');
                      },
                      onNotificationTap: () {
                        Navigator.pushNamed(context, '/teachernotifications');
                      },
                      profileImage: 'lib/images/teacher.png',
                      welcomeText: "CREATE POST",
                    ),
                  ),

                  // Main content
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: backgroundColor,
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                        ),
                        child: SingleChildScrollView(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Form section
                              Container(
                                margin: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: cardColor,
                                  borderRadius: BorderRadius.circular(16),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.05),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                padding: const EdgeInsets.all(20),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.post_add,
                                          color: teacherPrimaryColor,
                                          size: 28,
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          'Create a New Educator Post',
                                          style: TextStyle(
                                            fontSize: 22,
                                            fontWeight: FontWeight.bold,
                                            color: textColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 24),
                                    
                                    // Community Selection Dropdown
                                    Text(
                                      'Select Community',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: textColor,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Container(
                                      decoration: BoxDecoration(
                                        border: Border.all(color: Colors.grey.shade300),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: DropdownButtonHideUnderline(
                                        child: DropdownButton<String>(
                                          value: _selectedCommunity,
                                          hint: const Text('Choose a community'),
                                          isExpanded: true,
                                          padding: const EdgeInsets.symmetric(horizontal: 16),
                                          onChanged: (String? newValue) {
                                            setState(() {
                                              _selectedCommunity = newValue;
                                            });
                                          },
                                          items: _communities.map<DropdownMenuItem<String>>((community) {
                                            return DropdownMenuItem<String>(
                                              value: community['_id'].toString(),
                                              child: Text(community['name']),
                                            );
                                          }).toList(),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 24),
                                    
                                    // Post Title Field
                                    Text(
                                      'Title',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: textColor,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    TextFormField(
                                      controller: _titleController,
                                      decoration: InputDecoration(
                                        hintText: 'Enter a title for your post',
                                        border: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(8),
                                          borderSide: BorderSide(color: Colors.grey.shade300),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(8),
                                          borderSide: BorderSide(color: teacherPrimaryColor, width: 2),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 24),
                                    
                                    // Post Content Field
                                    Text(
                                      'Content',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: textColor,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    TextFormField(
                                      controller: _contentController,
                                      decoration: InputDecoration(
                                        hintText: 'Write your post content here...',
                                        border: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(8),
                                          borderSide: BorderSide(color: Colors.grey.shade300),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(8),
                                          borderSide: BorderSide(color: teacherPrimaryColor, width: 2),
                                        ),
                                      ),
                                      maxLines: 8,
                                    ),
                                    const SizedBox(height: 24),
                                    
                                    // Attachment Options
                                    Text(
                                      'Add Attachment (Optional)',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: textColor,
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    SingleChildScrollView(
                                      scrollDirection: Axis.horizontal,
                                      child: Row(
                                        children: [
                                          _buildAttachmentButton('image', Icons.image, 'Image'),
                                          const SizedBox(width: 8),
                                          _buildAttachmentButton('video', Icons.videocam, 'Video'),
                                          const SizedBox(width: 8),
                                          _buildAttachmentButton('link', Icons.link, 'Link'),
                                          const SizedBox(width: 8),
                                          _buildAttachmentButton('poll', Icons.poll, 'Poll'),
                                          const SizedBox(width: 8),
                                          _buildAttachmentButton('file', Icons.attach_file, 'Document'),
                                        ],
                                      ),
                                    ),
                                    
                                    // Conditional attachment URL field
                                    if (_attachmentType != null) ...[
                                      const SizedBox(height: 24),
                                      Text(
                                        _getAttachmentTypeLabel(),
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w500,
                                          color: textColor,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      TextFormField(
                                        controller: _attachmentController,
                                        decoration: InputDecoration(
                                          hintText: _getAttachmentHint(),
                                          border: OutlineInputBorder(
                                            borderRadius: BorderRadius.circular(8),
                                            borderSide: BorderSide(color: Colors.grey.shade300),
                                          ),
                                          focusedBorder: OutlineInputBorder(
                                            borderRadius: BorderRadius.circular(8),
                                            borderSide: BorderSide(color: teacherPrimaryColor, width: 2),
                                          ),
                                        ),
                                        maxLines: _attachmentType == 'poll' ? 4 : 1,
                                      ),
                                    ],
                                    
                                    const SizedBox(height: 24),
                                    
                                    // Teacher-specific options
                                    Text(
                                      'Post Options',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: textColor,
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    
                                    // Pin to top option
                                    SwitchListTile(
                                      title: const Text('Pin to top of community'),
                                      subtitle: const Text('Post will appear at the top of the community feed'),
                                      value: _isPinnedToTop,
                                      activeColor: teacherPrimaryColor,
                                      contentPadding: EdgeInsets.zero,
                                      onChanged: (bool value) {
                                        setState(() {
                                          _isPinnedToTop = value;
                                        });
                                      },
                                    ),
                                    
                                    // Featured option
                                    SwitchListTile(
                                      title: const Text('Mark as featured post'),
                                      subtitle: const Text('Highlight this post in the community'),
                                      value: _isFeatured,
                                      activeColor: teacherPrimaryColor,
                                      contentPadding: EdgeInsets.zero,
                                      onChanged: (bool value) {
                                        setState(() {
                                          _isFeatured = value;
                                        });
                                      },
                                    ),
                                    
                                    // Notification option
                                    SwitchListTile(
                                      title: const Text('Send notification to students'),
                                      subtitle: const Text('Alert students about this post'),
                                      value: _sendNotification,
                                      activeColor: teacherPrimaryColor,
                                      contentPadding: EdgeInsets.zero,
                                      onChanged: (bool value) {
                                        setState(() {
                                          _sendNotification = value;
                                        });
                                      },
                                    ),
                                    
                                    const SizedBox(height: 32),
                                    
                                    // Submit Button
                                    SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton(
                                        onPressed: _handleSubmit,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: teacherPrimaryColor,
                                          foregroundColor: Colors.white,
                                          padding: const EdgeInsets.symmetric(vertical: 15),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                        ),
                                        child: const Text(
                                          'Post to Community',
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              
                              // Educator Guidelines section
                              Container(
                                margin: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: cardColor,
                                  borderRadius: BorderRadius.circular(16),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.05),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                padding: const EdgeInsets.all(20),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Educator Guidelines',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: textColor,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    _buildGuidelineItem('Share educational insights and teaching strategies.'),
                                    _buildGuidelineItem('Provide supportive feedback to fellow educators.'),
                                    _buildGuidelineItem('Respect student privacy when discussing classroom experiences.'),
                                    _buildGuidelineItem('Contribute to professional development discussions.'),
                                    _buildGuidelineItem('Focus on evidence-based educational practices.'),
                                    
                                    const SizedBox(height: 16),
                                    Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        color: teacherPrimaryColor.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(
                                          color: teacherPrimaryColor.withOpacity(0.3),
                                        ),
                                      ),
                                      child: Text(
                                        'Note: As an educator, your contributions help shape the learning community. Posts are moderated to maintain professional standards.',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: teacherPrimaryColor.withOpacity(0.8),
                                        ),
                                      ),
                                    ),
                                  ],
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
            ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildAttachmentButton(String type, IconData icon, String label) {
    final bool isSelected = _attachmentType == type;
    
    return ElevatedButton.icon(
      onPressed: () => _setAttachmentType(type),
      icon: Icon(icon, size: 18),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? teacherPrimaryColor : Colors.grey.shade200,
        foregroundColor: isSelected ? Colors.white : textColor,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
        ),
      ),
    );
  }

  Widget _buildGuidelineItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 16,
            height: 16,
            margin: const EdgeInsets.only(top: 4),
            decoration: BoxDecoration(
              color: teacherPrimaryColor,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 14,
                color: textColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getAttachmentTypeLabel() {
    switch (_attachmentType) {
      case 'image':
        return 'Image URL';
      case 'video':
        return 'Video URL';
      case 'link':
        return 'Link URL';
      case 'poll':
        return 'Poll Options (one per line)';
      case 'file':
        return 'Document URL';
      default:
        return 'Attachment';
    }
  }

  String _getAttachmentHint() {
    switch (_attachmentType) {
      case 'image':
        return 'Enter the URL of your image';
      case 'video':
        return 'Enter the URL of your video';
      case 'link':
        return 'Enter the URL to share';
      case 'poll':
        return 'Option 1\nOption 2\nOption 3\n...';
      case 'file':
        return 'Enter URL to PDF or document';
      default:
        return '';
    }
  }
}