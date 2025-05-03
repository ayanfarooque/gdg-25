import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';
import '../components/teacherheader.dart';
import '../components/footer.dart';
import 'dart:math';
import 'create_post.dart';

class FacCommunityLanding extends StatefulWidget {
  @override
  State<FacCommunityLanding> createState() => _FacCommunityLandingState();
}

class _FacCommunityLandingState extends State<FacCommunityLanding>
    with SingleTickerProviderStateMixin {
  int _selectedIndex = 2; // Set to 2 for community tab
  String _selectedCategory = "All Communities";
  List<dynamic> _communities = [];
  List<dynamic> _filteredCommunities = [];
  List<dynamic> _posts = [];
  List<dynamic> _recommendedCommunities = [];
  List<dynamic> _categories = [];
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";
  bool _isLoading = true;
  late TabController _tabController;

  // Theme colors
  final Color teacherPrimaryColor = const Color(0xFFE195AB);
  final Color backgroundColor = const Color(0xFFF5F5DD);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = const Color(0xFF49ABB0);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadCommunityData();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  void _loadCommunityData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final String response =
          await rootBundle.loadString('lib/data/community.json');
      final data = await json.decode(response);
      setState(() {
        _communities = data['communities'] ?? [];
        _filteredCommunities = _communities;
        _posts = data['posts'] ?? [];
        _recommendedCommunities = data['recommendedCommunities'] ?? [];
        _categories = data['categories'] ?? [];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading community data: $e');
      setState(() {
        _isLoading = false;
        // Add some mock data if JSON loading fails
        _communities = [
          {
            "name": "Physics Enthusiasts",
            "shortDescription":
                "Explore the fascinating world of physics together",
            "subject": "Physics",
            "memberCount": 156,
            "avatar":
                "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop",
          },
          {
            "name": "Math Problem Solvers",
            "shortDescription": "Collaborative mathematics problem solving",
            "subject": "Mathematics",
            "memberCount": 213,
            "avatar":
                "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
          }
        ];
        _filteredCommunities = _communities;

        // Add fallback recommended communities
        _recommendedCommunities = [
          {
            "name": "Biology Club",
            "shortDescription": "Explore the wonders of biology",
            "subject": "Biology",
            "memberCount": 124,
            "avatar":
                "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&auto=format&fit=crop",
          },
          {
            "name": "History Buffs",
            "shortDescription": "Discussing historical events and their impact",
            "subject": "History",
            "memberCount": 98,
            "avatar":
                "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop",
          }
        ];
      });
    }
  }

  void _onSearchChanged() {
    _filterCommunities();
  }

  void _filterCommunities() {
    setState(() {
      _searchQuery = _searchController.text;

      // Filter communities based on search query and selected category
      _filteredCommunities = _communities.where((community) {
        // Match search query
        final matchesSearch = _searchQuery.isEmpty ||
            community['name']
                .toLowerCase()
                .contains(_searchQuery.toLowerCase()) ||
            (community['description'] != null &&
                community['description']
                    .toLowerCase()
                    .contains(_searchQuery.toLowerCase()));

        // Match category
        final matchesCategory = _selectedCategory == "All Communities" ||
            (community['subject'] != null &&
                community['subject'].toLowerCase() ==
                    _selectedCategory.toLowerCase()) ||
            (community['categories'] != null &&
                community['categories']
                    .contains(_selectedCategory.toLowerCase()));

        return matchesSearch && matchesCategory;
      }).toList();
    });
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

  void _selectCategory(String category) {
    setState(() {
      _selectedCategory = category;
    });
    _filterCommunities();
  }

  // Helper method to get trending communities
  List<dynamic> _getTrendingCommunities() {
    try {
      final trendingCommunities = List<dynamic>.from(_filteredCommunities);

      // Sort by member count if available
      trendingCommunities.sort((a, b) {
        int aCount = 0;
        int bCount = 0;

        if (a['stats'] != null && a['stats']['memberCount'] != null) {
          aCount = a['stats']['memberCount'];
        } else if (a['memberCount'] != null) {
          aCount = a['memberCount'];
        }

        if (b['stats'] != null && b['stats']['memberCount'] != null) {
          bCount = b['stats']['memberCount'];
        } else if (b['memberCount'] != null) {
          bCount = b['memberCount'];
        }

        return bCount.compareTo(aCount);
      });

      return trendingCommunities;
    } catch (e) {
      print('Error getting trending communities: $e');
      return _filteredCommunities;
    }
  }

  // Helper method to get fallback recommended communities if the JSON data is missing
  List<dynamic> _getDefaultRecommendedCommunities() {
    // Generate some recommendations based on subject areas that might be interesting
    if (_communities.isNotEmpty) {
      // Return a few random communities as recommendations
      final recommendations = List<dynamic>.from(_communities);
      recommendations.shuffle(); // Random order
      return recommendations.take(min(3, recommendations.length)).toList();
    }

    // If all else fails, return these default recommendations
    return [
      {
        "name": "Literature Circle",
        "shortDescription": "Discussing great works of literature",
        "subject": "English",
        "memberCount": 142,
        "avatar":
            "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop",
      },
      {
        "name": "Computer Science Hub",
        "shortDescription": "Coding, algorithms and computer science topics",
        "subject": "Computer Science",
        "memberCount": 189,
        "avatar":
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop",
      }
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: teacherPrimaryColor,
      drawer: _buildDrawer(),
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
                      welcomeText: "WELCOME SENSEI",
                    ),
                  ),

                  // Main content
                  Expanded(
                    child: ClipRRect(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                      child: Container(
                        color: backgroundColor,
                        child: Column(
                          children: [
                            // Search bar and filter button
                            Padding(
                              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: TextField(
                                      controller: _searchController,
                                      decoration: InputDecoration(
                                        hintText: "Search communities",
                                        prefixIcon: Icon(Icons.search),
                                        border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(30),
                                          borderSide: BorderSide.none,
                                        ),
                                        filled: true,
                                        fillColor: Colors.white,
                                        contentPadding:
                                            EdgeInsets.symmetric(vertical: 0),
                                      ),
                                    ),
                                  ),
                                  SizedBox(width: 8),
                                  InkWell(
                                    onTap: _showFilterSheet,
                                    child: Container(
                                      padding: EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(30),
                                      ),
                                      child: Icon(Icons.filter_list),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Tab Bar
                            Container(
                              margin: EdgeInsets.symmetric(horizontal: 16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(30),
                              ),
                              child: TabBar(
                                controller: _tabController,
                                labelColor: teacherPrimaryColor,
                                unselectedLabelColor: Colors.grey,
                                indicator: BoxDecoration(
                                  color: teacherPrimaryColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(30),
                                ),
                                tabs: const [
                                  Tab(text: "ALL"),
                                  Tab(text: "TRENDING"),
                                  Tab(text: "RECOMMENDED"),
                                ],
                              ),
                            ),

                            // Category title
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: Row(
                                children: [
                                  Text(
                                    _selectedCategory,
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: textColor,
                                    ),
                                  ),
                                  Spacer(),
                                  Text(
                                    "${_filteredCommunities.length} communities",
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey[700],
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Tab content
                            Expanded(
                              child: TabBarView(
                                controller: _tabController,
                                children: [
                                  // All Communities tab
                                  _buildCommunitiesList(_filteredCommunities),

                                  // Trending Communities tab
                                  _buildCommunitiesList(
                                      _getTrendingCommunities()),

                                  // Recommended Communities tab
                                  _buildCommunitiesList(_recommendedCommunities
                                          .isNotEmpty
                                      ? _recommendedCommunities
                                      : _getDefaultRecommendedCommunities()),
                                ],
                              ),
                            ),
                          ],
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
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _showCreateOptions();
        },
        backgroundColor: teacherPrimaryColor,
        child: Icon(Icons.add),
      ),
    );
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "Filter by Category",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: _categories.length,
                itemBuilder: (context, index) {
                  final category = _categories[index];
                  final bool isSelected = _selectedCategory == category['name'];

                  IconData iconData;
                  switch (category['icon']) {
                    case 'grid':
                      iconData = Icons.grid_view;
                      break;
                    case 'science':
                      iconData = Icons.science;
                      break;
                    case 'calculate':
                      iconData = Icons.calculate;
                      break;
                    case 'translate':
                      iconData = Icons.translate;
                      break;
                    case 'public':
                      iconData = Icons.public;
                      break;
                    case 'palette':
                      iconData = Icons.palette;
                      break;
                    default:
                      iconData = Icons.category;
                  }

                  return ListTile(
                    title: Text(
                      category['name'],
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight:
                            isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                    leading: Icon(
                      iconData,
                      color: isSelected ? teacherPrimaryColor : Colors.grey,
                    ),
                    trailing: isSelected
                        ? Icon(Icons.check_circle, color: teacherPrimaryColor)
                        : null,
                    onTap: () {
                      _selectCategory(category['name']);
                      Navigator.pop(context);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      child: Container(
        color: backgroundColor,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: teacherPrimaryColor,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundImage: AssetImage('lib/images/teacher.png'),
                  ),
                  SizedBox(height: 10),
                  Text(
                    "Teacher Community",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    "Connect with other educators",
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),

            // Categories List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                "CATEGORIES",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[700],
                ),
              ),
            ),
            ..._categories.map((category) {
              final bool isSelected = _selectedCategory == category['name'];

              IconData iconData;
              switch (category['icon']) {
                case 'grid':
                  iconData = Icons.grid_view;
                  break;
                case 'science':
                  iconData = Icons.science;
                  break;
                case 'calculate':
                  iconData = Icons.calculate;
                  break;
                case 'translate':
                  iconData = Icons.translate;
                  break;
                case 'public':
                  iconData = Icons.public;
                  break;
                case 'palette':
                  iconData = Icons.palette;
                  break;
                default:
                  iconData = Icons.category;
              }

              return ListTile(
                title: Text(
                  category['name'],
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight:
                        isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
                leading: Icon(
                  iconData,
                  color: isSelected ? teacherPrimaryColor : Colors.grey,
                ),
                selected: isSelected,
                selectedTileColor: teacherPrimaryColor.withOpacity(0.1),
                onTap: () {
                  _selectCategory(category['name']);
                  Navigator.pop(context);
                },
              );
            }).toList(),

            Divider(),

            // Trending Posts
            ListTile(
              title: Text("Trending Posts"),
              leading: Icon(Icons.trending_up),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/teachercommunity/posts');
              },
            ),

            // My Communities
            ListTile(
              title: Text("My Communities"),
              leading: Icon(Icons.group),
              onTap: () {
                Navigator.pop(context);
                // Navigate to My Communities
              },
            ),

            // Settings
            ListTile(
              title: Text("Community Settings"),
              leading: Icon(Icons.settings),
              onTap: () {
                Navigator.pop(context);
                // Navigate to Community Settings
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCommunitiesList(List<dynamic> communities) {
    if (communities.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.group_off,
              size: 64,
              color: Colors.grey[400],
            ),
            SizedBox(height: 16),
            Text(
              "No communities found",
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Text(
              "Try adjusting your filters",
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.symmetric(horizontal: 16),
      itemCount: communities.length,
      itemBuilder: (context, index) {
        return _buildCommunityCard(communities[index]);
      },
    );
  }

  Widget _buildCommunityCard(dynamic community) {
    // Safely get community data with fallbacks for missing fields
    final String name = community['name'] ?? 'Unnamed Community';
    final String description = community['shortDescription'] ??
        community['description'] ??
        'No description available';
    final String subject = community['subject'] ?? 'General';

    // Get member count from different possible locations in the data structure
    int memberCount = 0;
    if (community['stats'] != null &&
        community['stats']['memberCount'] != null) {
      memberCount = community['stats']['memberCount'];
    } else if (community['memberCount'] != null) {
      memberCount = community['memberCount'];
    }

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 2,
      child: InkWell(
        onTap: () {
          // Navigate to community detail
        },
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner image with overlay
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                  child: Image.network(
                    community['banner'] ??
                        community['avatar'] ??
                        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop',
                    height: 120,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 120,
                        color: teacherPrimaryColor.withOpacity(0.3),
                        child: Center(
                          child: Icon(Icons.image_not_supported,
                              color: Colors.white),
                        ),
                      );
                    },
                  ),
                ),

                // Gradient overlay for better text readability
                Positioned.fill(
                  child: ClipRRect(
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(16)),
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withOpacity(0.7),
                          ],
                          stops: [0.5, 1.0],
                        ),
                      ),
                    ),
                  ),
                ),

                // Community avatar
                Positioned(
                  top: 16,
                  left: 16,
                  child: CircleAvatar(
                    radius: 24,
                    backgroundColor: Colors.white,
                    backgroundImage: NetworkImage(
                      community['avatar'] ??
                          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop',
                    ),
                    onBackgroundImageError: (e, trace) {},
                  ),
                ),

                // Verified badge if applicable
                if (community['isVerified'] == true)
                  Positioned(
                    top: 16,
                    right: 16,
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.blue,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.verified, color: Colors.white, size: 12),
                          SizedBox(width: 4),
                          Text(
                            "Verified",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                // Community name at bottom
                Positioned(
                  bottom: 16,
                  left: 16,
                  right: 16,
                  child: Text(
                    name,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      shadows: [
                        Shadow(
                          offset: Offset(0, 1),
                          blurRadius: 3,
                          color: Colors.black.withOpacity(0.5),
                        ),
                      ],
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),

            // Description and stats
            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[800],
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.people, size: 16, color: Colors.grey[600]),
                          SizedBox(width: 4),
                          Text(
                            "$memberCount members",
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Icon(Icons.book, size: 16, color: Colors.grey[600]),
                          SizedBox(width: 4),
                          Text(
                            subject,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton(
                        onPressed: () {
                          // Join community
                        },
                        child: Text("Join"),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: teacherPrimaryColor,
                          foregroundColor: Colors.white,
                          padding:
                              EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                          minimumSize: Size(0, 32),
                          textStyle: TextStyle(fontSize: 12),
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

  // Update the _showCreateOptions method in the _FacCommunityLandingState class

  void _showCreateOptions() {
    showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "Create",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 24),
            ListTile(
              leading: CircleAvatar(
                backgroundColor: teacherPrimaryColor.withOpacity(0.2),
                child: Icon(Icons.post_add, color: teacherPrimaryColor),
              ),
              title: Text("Create a Post"),
              subtitle: Text("Share information or ask a question"),
              onTap: () {
                Navigator.pop(context);
                // Navigate to create post page
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => FacCreatePostPage(),
                  ),
                );
              },
            ),
            ListTile(
              leading: CircleAvatar(
                backgroundColor: accentColor.withOpacity(0.2),
                child: Icon(Icons.group_add, color: accentColor),
              ),
              title: Text("Create a Community"),
              subtitle: Text("Start a new group around a topic or subject"),
              onTap: () {
                Navigator.pop(context);
                // Navigate to create community page
                // For now, we'll just show a snackbar
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                      content: Text('Creating a community is coming soon!')),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  String _getTimeAgo(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 30) {
      return DateFormat.yMMMd().format(dateTime);
    } else if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }
}
