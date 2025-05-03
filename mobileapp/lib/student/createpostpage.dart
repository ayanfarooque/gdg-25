import 'package:flutter/material.dart';
import '../components/header.dart';
import '../components/footer.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class CreatePostPage extends StatefulWidget {
  final String? initialCommunity;
  
  const CreatePostPage({Key? key, this.initialCommunity}) : super(key: key);

  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  int _selectedIndex = 2; // Community tab
  
  // Form controllers
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();
  final TextEditingController _attachmentController = TextEditingController();
  
  // Form values
  String? _selectedCommunity;
  String? _attachmentType;

  // Theme colors for student
  final Color studentPrimaryColor = const Color.fromARGB(255, 73, 171, 176);
  final Color backgroundColor = const Color.fromARGB(255, 236, 231, 202);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  
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
            "name": "Physics Enthusiasts",
          },
          {
            "_id": "2",
            "name": "Math Problem Solvers",
          },
          {
            "_id": "3",
            "name": "Computer Science Hub",
          },
          {
            "_id": "4",
            "name": "Literature Circle",
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
        Navigator.pushReplacementNamed(context, '/');
        break;
      case 1:
        Navigator.pushNamed(context, '/assignment');
        break;
      case 2:
        Navigator.pushNamed(context, '/community');
        break;
      case 3:
        Navigator.pushNamed(context, '/aibot');
        break;
      case 4:
        Navigator.pushNamed(context, '/resources');
        break;
      case 5:
        Navigator.pushNamed(context, '/classroom');
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
      const SnackBar(content: Text('Post created successfully!')),
    );
    
    // Navigate back to the community page
    Navigator.pushReplacementNamed(context, '/community');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: studentPrimaryColor,
      appBar: AppBar(
        backgroundColor: studentPrimaryColor,
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
            Navigator.pushReplacementNamed(context, '/community');
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
                    child: Header(
                      onProfileTap: () {
                        Navigator.pushNamed(context, '/profile');
                      },
                      onNotificationTap: () {
                        Navigator.pushNamed(context, '/notifications');
                      },
                      profileImage: 'assets/images/image3.png',
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
                                    Text(
                                      'Create a New Post',
                                      style: TextStyle(
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                        color: textColor,
                                      ),
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
                                          borderSide: BorderSide(color: studentPrimaryColor, width: 2),
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
                                          borderSide: BorderSide(color: studentPrimaryColor, width: 2),
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
                                            borderSide: BorderSide(color: studentPrimaryColor, width: 2),
                                          ),
                                        ),
                                        maxLines: _attachmentType == 'poll' ? 4 : 1,
                                      ),
                                    ],
                                    
                                    const SizedBox(height: 32),
                                    
                                    // Submit Button
                                    SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton(
                                        onPressed: _handleSubmit,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: studentPrimaryColor,
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
                              
                              // Guidelines section
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
                                      'Community Guidelines',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: textColor,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    _buildGuidelineItem('Be respectful and courteous to other community members.'),
                                    _buildGuidelineItem('Share relevant content that adds value to the community.'),
                                    _buildGuidelineItem('Avoid posting personal or sensitive information.'),
                                    _buildGuidelineItem('No spamming or promotional content without permission.'),
                                    _buildGuidelineItem('Help foster a positive learning environment.'),
                                    
                                    const SizedBox(height: 16),
                                    Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        color: studentPrimaryColor.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(
                                          color: studentPrimaryColor.withOpacity(0.3),
                                        ),
                                      ),
                                      child: Text(
                                        'Note: Posts are reviewed by community moderators and may be removed if they violate the community guidelines.',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: studentPrimaryColor.withOpacity(0.8),
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
        backgroundColor: isSelected ? studentPrimaryColor : Colors.grey.shade200,
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
              color: studentPrimaryColor,
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
      default:
        return '';
    }
  }
}