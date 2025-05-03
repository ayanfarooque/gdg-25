import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:dummyapp/components/footer.dart';
import 'ClassroomDetailScreen.dart';

class ClassroomLanding extends StatefulWidget {
  const ClassroomLanding({Key? key}) : super(key: key);

  @override
  State<ClassroomLanding> createState() => _ClassroomLandingState();
}

class _ClassroomLandingState extends State<ClassroomLanding> {
  int _selectedIndex = 5; // Set to 5 for Classroom in the footer
  bool _isLoading = true;
  List<dynamic> _classrooms = [];
  String _activeTab = 'classes'; // 'classes' or 'join'
  final TextEditingController _joinCodeController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadClassrooms();
  }

  Future<void> _loadClassrooms() async {
    try {
      // Load the JSON file (in a real app, this would be an API call)
      final String response =
          await rootBundle.loadString('lib/data/classroom.json');
      final data = await json.decode(response);

      setState(() {
        _classrooms = List.from(data);
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      print('Error loading classroom data: $e');
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
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

    // Navigation would happen here based on index
    // This is simplified for this example
  }

  void _switchTab(String tab) {
    setState(() {
      _activeTab = tab;
    });
  }

  void _handleClassroomClick(String id) {
    // Use the named route to navigate to the detailed screen
    Navigator.pushNamed(context, '/classroom_detail',
        arguments: {'classroomId': id});
  }

  void _handleJoinClassroom() {
    if (_joinCodeController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid classroom code')),
      );
      return;
    }

    // In a real app, this would make an API call
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Join request sent successfully!')),
    );
    _joinCodeController.clear();
  }

  Color _getRandomColor() {
    final List<Color> colors = [
      const Color(0xFF4776E6),
      const Color(0xFF11998e),
      const Color(0xFFFF8008),
      const Color(0xFF2193b0),
      const Color(0xFF834d9b),
      const Color(0xFF1a2a6c),
    ];
    return colors[DateTime.now().millisecondsSinceEpoch % colors.length];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Classroom'),
        backgroundColor: Colors.white,
        elevation: 1,
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Page Header
          Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  blurRadius: 5,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Learning Environment',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Manage your enrolled classrooms and join new ones',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    // Classes tab
                    Expanded(
                      child: InkWell(
                        onTap: () => _switchTab('classes'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: _activeTab == 'classes'
                                ? const Color(0xFF49ABB0)
                                : Colors.grey.shade200,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'My Classes',
                            style: TextStyle(
                              color: _activeTab == 'classes'
                                  ? Colors.white
                                  : Colors.black87,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Join tab
                    Expanded(
                      child: InkWell(
                        onTap: () => _switchTab('join'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: _activeTab == 'join'
                                ? const Color(0xFF49ABB0)
                                : Colors.grey.shade200,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Join Classroom',
                            style: TextStyle(
                              color: _activeTab == 'join'
                                  ? Colors.white
                                  : Colors.black87,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Main content
          Expanded(
            child:
                _activeTab == 'classes' ? _buildClassesTab() : _buildJoinTab(),
          ),
        ],
      ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildClassesTab() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_classrooms.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.add_circle_outline,
                size: 60, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            const Text(
              'No classrooms yet',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'You haven\'t joined any classrooms yet.',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => _switchTab('join'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF49ABB0),
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Join Your First Classroom'),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _classrooms.length,
      itemBuilder: (context, index) {
        final classroom = _classrooms[index];
        return _buildClassroomCard(classroom);
      },
    );
  }

  Widget _buildClassroomCard(dynamic classroom) {
    final String id = classroom["_id"];
    final String name = classroom["name"];
    final String subject = classroom["subject"];
    final String description = classroom["description"];
    final int studentCount = classroom["students"].length;
    final Color cardColor = _getRandomColor();

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () => _handleClassroomClick(id),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner
            Container(
              height: 100,
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12),
                  topRight: Radius.circular(12),
                ),
              ),
              padding: const EdgeInsets.all(16),
              alignment: Alignment.bottomLeft,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    subject,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Teacher info
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.person,
                              size: 18,
                              color: const Color(0xFF49ABB0).withOpacity(0.8)),
                          const SizedBox(width: 6),
                          const Text(
                            "Teacher", // Would be teacher name in a real app
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF49ABB0).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Active',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF49ABB0),
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Student count
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.group,
                          size: 18,
                          color: const Color(0xFF49ABB0).withOpacity(0.8)),
                      const SizedBox(width: 6),
                      Text(
                        "$studentCount students enrolled",
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),

                  // Divider
                  const Divider(height: 24),

                  // Description
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.description,
                          size: 18, color: Colors.grey),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          description.length > 100
                              ? description.substring(0, 100) + "..."
                              : description,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildJoinTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  blurRadius: 5,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Join a New Classroom',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Enter the classroom code provided by your teacher to request access',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 16),

                // Code input field
                TextField(
                  controller: _joinCodeController,
                  decoration: InputDecoration(
                    hintText: 'Enter classroom code',
                    prefixIcon: const Icon(Icons.key, color: Colors.grey),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(
                        color: Color(0xFF49ABB0),
                        width: 2,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Join button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _handleJoinClassroom,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF49ABB0),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Request to Join'),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Info box
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  Icons.info_outline,
                  color: Colors.blue.shade700,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'How it works',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.blue.shade700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Enter the code and submit a join request. Once approved by your teacher, you\'ll gain access to the classroom materials and assignments.',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.blue.shade700,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class SimpleClassroomDetail extends StatelessWidget {
  // Changed from ClassroomDetailScreen
  final String classroomId;

  const SimpleClassroomDetail({
    // Update constructor name too
    Key? key,
    required this.classroomId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // This is a placeholder for classroom details screen
    // In a real app, you would fetch data for the specific classroom
    return Scaffold(
      appBar: AppBar(
        title: const Text('Classroom Details'),
        backgroundColor: Colors.white,
      ),
      body: Center(
        child: Text('Classroom Details for ID: $classroomId'),
      ),
    );
  }
}
