import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';
import '../../components/header.dart';
import '../../components/footer.dart';

class ResourceLanding extends StatefulWidget {
  @override
  State<ResourceLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<ResourceLanding>
    with SingleTickerProviderStateMixin {
  int _selectedIndex = 4; // Resources tab
  List<dynamic> _news = [];
  List<dynamic> _resources = [];
  List<dynamic> _filteredItems = [];
  List<String> _subjects = ["All"];
  List<String> _categories = ["All"];
  String _activeFilter = "All";

  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";
  bool _showRecommended = true;
  bool _showResources = false;
  bool _showNews = false;
  bool _isLoading = true;

  // For tab control between Resources and News
  late TabController _tabController;

  // Theme colors for student
  final Color studentPrimaryColor = const Color.fromARGB(255, 73, 171, 176);
  final Color backgroundColor = const Color.fromARGB(255, 236, 231, 202);
  final Color cardColor = Colors.white;
  final Color textColor = Colors.black87;
  final Color accentColor = Colors.amber;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(_handleTabChange);
    _loadData();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _tabController.removeListener(_handleTabChange);
    _tabController.dispose();
    super.dispose();
  }

  void _handleTabChange() {
    if (_tabController.index == 0) {
      _showAllResources();
    } else {
      _showAllNews();
    }
  }

  void _loadData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final String newsResponse =
          await rootBundle.loadString('lib/data/news.json');
      final newsData = json.decode(newsResponse);

      try {
        final String resourcesResponse =
            await rootBundle.loadString('lib/data/resources.json');
        final resourcesData = json.decode(resourcesResponse);

        // Extract all subjects from resources
        final Set<String> subjectsSet = Set<String>();
        for (var resource in resourcesData) {
          if (resource['metadata'] != null &&
              resource['metadata']['subject'] != null) {
            subjectsSet.add(resource['metadata']['subject']);
          }
        }

        // Extract all categories from news
        final Set<String> categoriesSet = Set<String>();
        for (var item in newsData) {
          if (item['category'] != null) {
            categoriesSet.add(item['category']);
          }
        }

        setState(() {
          _news = newsData;
          _resources = resourcesData;
          _subjects = ["All", ...subjectsSet.toList()];
          _categories = ["All", ...categoriesSet.toList()];
          _showRecommended = true;
          _showResources = false;
          _showNews = false;
          _updateFilteredItems();
          _isLoading = false;
        });
      } catch (e) {
        print("Error loading resources: $e");
        setState(() {
          _news = newsData;
          _resources = [];
          _filteredItems = _news;
          _isLoading = false;
        });
      }
    } catch (e) {
      print("Error loading news: $e");
      setState(() {
        _news = [];
        _resources = [];
        _filteredItems = [];
        _isLoading = false;
      });
    }
  }

  void _updateFilteredItems() {
    List<dynamic> items = [];

    if (_showRecommended) {
      // Get starred/featured items from both resources and news
      items = [
        ..._resources
            .where(
                (item) => item['isFeatured'] == true || item['stared'] == true)
            .toList(),
        ..._news
            .where(
                (item) => item['isFeatured'] == true || item['stared'] == true)
            .toList()
      ];
    } else if (_showResources) {
      items = List.from(_resources);

      // Apply subject filter for resources
      if (_activeFilter != "All") {
        items = items
            .where((item) =>
                item['metadata'] != null &&
                item['metadata']['subject'] != null &&
                item['metadata']['subject'] == _activeFilter)
            .toList();
      }
    } else if (_showNews) {
      items = List.from(_news);

      // Apply category filter for news
      if (_activeFilter != "All") {
        items = items
            .where((item) =>
                item['category'] != null && item['category'] == _activeFilter)
            .toList();
      }
    } else {
      items = [..._resources, ..._news];
    }

    // Apply search filter if there's a query
    if (_searchQuery.isNotEmpty) {
      items = items.where((item) {
        // For resources
        if (item.containsKey('resourceTitle') || item.containsKey('title')) {
          String title = item.containsKey('resourceTitle')
              ? item['resourceTitle']
              : (item.containsKey('title') ? item['title'] : '');

          String description =
              item.containsKey('description') ? item['description'] : '';

          return title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
              description.toLowerCase().contains(_searchQuery.toLowerCase());
        }

        // For news
        if (item.containsKey('newsHeading') || item.containsKey('title')) {
          String title = item.containsKey('newsHeading')
              ? item['newsHeading']
              : (item.containsKey('title') ? item['title'] : '');

          String content = item.containsKey('content') ? item['content'] : '';

          return title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
              content.toLowerCase().contains(_searchQuery.toLowerCase());
        }

        return false;
      }).toList();
    }

    setState(() {
      _filteredItems = items;
    });
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text;
      _updateFilteredItems();
    });
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

  void _showRecommendedCards() {
    setState(() {
      _showRecommended = true;
      _showResources = false;
      _showNews = false;
      _activeFilter = "All";
      _updateFilteredItems();
    });
  }

  void _showAllResources() {
    setState(() {
      _showRecommended = false;
      _showResources = true;
      _showNews = false;
      _activeFilter = "All";
      _updateFilteredItems();
    });
  }

  void _showAllNews() {
    setState(() {
      _showRecommended = false;
      _showResources = false;
      _showNews = true;
      _activeFilter = "All";
      _updateFilteredItems();
    });
  }

  void _applyFilter(String filter) {
    setState(() {
      _activeFilter = filter;
      _updateFilteredItems();
    });
  }

  // Format date similar to web version
  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return DateFormat.yMMMd().format(date);
    } catch (e) {
      return dateString;
    }
  }

  // Format file size
  String _formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    if (bytes < 1024 * 1024 * 1024)
      return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
  }

  // Format duration from seconds
  String _formatDuration(int seconds) {
    int minutes = seconds ~/ 60;
    int remainingSeconds = seconds % 60;
    return '$minutes:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  // Get file type icon
  IconData _getFileTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'pdf':
        return Icons.picture_as_pdf;
      case 'document':
        return Icons.description;
      case 'video':
        return Icons.video_library;
      case 'image':
        return Icons.image;
      case 'code':
        return Icons.code;
      default:
        return Icons.insert_drive_file;
    }
  }

  // Get badge color for file type
  Color _getTypeBadgeColor(String type) {
    switch (type.toLowerCase()) {
      case 'pdf':
        return Colors.red;
      case 'document':
        return Colors.blue;
      case 'video':
        return Colors.purple;
      case 'image':
        return Colors.green;
      case 'code':
        return Colors.blueGrey;
      default:
        return Colors.grey;
    }
  }

  // Get badge color for news category
  Color _getCategoryBadgeColor(String category) {
    switch (category.toLowerCase()) {
      case 'announcement':
        return Colors.blue;
      case 'event':
        return Colors.purple;
      case 'achievement':
        return Colors.green;
      case 'academic':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: studentPrimaryColor,
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
                      welcomeText: "WELCOME",
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
                            // Title and search bar
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            "RESOURCES",
                                            style: TextStyle(
                                              fontSize: 20,
                                              fontWeight: FontWeight.bold,
                                              color: textColor,
                                            ),
                                          ),
                                          Text(
                                            _showRecommended
                                                ? "Recommended for you"
                                                : (_showResources
                                                    ? "Browse all resources"
                                                    : "Latest news"),
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  SizedBox(height: 16),
                                  // Search bar
                                  Container(
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(30),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.05),
                                          blurRadius: 10,
                                          offset: Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    child: TextField(
                                      controller: _searchController,
                                      decoration: InputDecoration(
                                        hintText: "Search",
                                        prefixIcon: Icon(Icons.search),
                                        border: InputBorder.none,
                                        contentPadding:
                                            EdgeInsets.symmetric(vertical: 15),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Tab Bar for switching between Resources and News
                            Container(
                              margin: EdgeInsets.symmetric(horizontal: 16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(30),
                              ),
                              child: TabBar(
                                controller: _tabController,
                                labelColor: studentPrimaryColor,
                                unselectedLabelColor: Colors.grey,
                                indicator: BoxDecoration(
                                  color: studentPrimaryColor.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(30),
                                ),
                                tabs: [
                                  Tab(text: "RESOURCES"),
                                  Tab(text: "NEWS"),
                                ],
                              ),
                            ),

                            // Filter chips row
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Container(
                                height: 40,
                                child: SingleChildScrollView(
                                  scrollDirection: Axis.horizontal,
                                  child: Row(
                                    children: [
                                      // Featured/Recommended filter chip
                                      FilterChip(
                                        selected: _showRecommended,
                                        showCheckmark: false,
                                        label: Text("Recommended"),
                                        labelStyle: TextStyle(
                                          color: _showRecommended
                                              ? Colors.white
                                              : Colors.grey[700],
                                        ),
                                        selectedColor: studentPrimaryColor,
                                        backgroundColor: Colors.white,
                                        onSelected: (selected) {
                                          if (selected) _showRecommendedCards();
                                        },
                                      ),
                                      SizedBox(width: 8),

                                      // Display subject filters for Resources tab or category filters for News tab
                                      ...(_tabController.index == 0
                                              ? _subjects
                                              : _categories)
                                          .map((filter) {
                                        return Padding(
                                          padding: EdgeInsets.only(right: 8),
                                          child: FilterChip(
                                            selected: _activeFilter == filter,
                                            showCheckmark: false,
                                            label: Text(filter),
                                            labelStyle: TextStyle(
                                              color: _activeFilter == filter
                                                  ? Colors.white
                                                  : Colors.grey[700],
                                            ),
                                            selectedColor: studentPrimaryColor,
                                            backgroundColor: Colors.white,
                                            onSelected: (selected) {
                                              if (selected) {
                                                _applyFilter(filter);
                                                if (_tabController.index == 0) {
                                                  _showAllResources();
                                                } else {
                                                  _showAllNews();
                                                }
                                              }
                                            },
                                          ),
                                        );
                                      }).toList(),
                                    ],
                                  ),
                                ),
                              ),
                            ),

                            // Content area - Resources/News cards
                            Expanded(
                              child: _filteredItems.isEmpty
                                  ? _buildEmptyState()
                                  : ListView.builder(
                                      padding:
                                          EdgeInsets.fromLTRB(16, 0, 16, 16),
                                      itemCount: _filteredItems.length,
                                      itemBuilder: (context, index) {
                                        final item = _filteredItems[index];

                                        // Check if this is a resource or news item
                                        if (item.containsKey('resourceTitle') ||
                                            (item.containsKey('metadata') &&
                                                item.containsKey('file'))) {
                                          return _buildResourceCard(item);
                                        } else {
                                          return _buildNewsCard(item);
                                        }
                                      },
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
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            _showResources ? Icons.folder_open : Icons.article,
            size: 64,
            color: Colors.grey[400],
          ),
          SizedBox(height: 16),
          Text(
            "No ${_showResources ? 'resources' : 'news'} found",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[700],
            ),
          ),
          SizedBox(height: 8),
          Text(
            "Try adjusting your filters",
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResourceCard(dynamic resource) {
    // Extract necessary data with proper null checks
    final String title =
        resource['resourceTitle'] ?? resource['title'] ?? 'Untitled Resource';
    final String description =
        resource['description'] ?? 'No description available';
    final bool isFeatured = resource['isFeatured'] ?? false;

    // Get metadata with fallbacks
    final Map<String, dynamic> metadata = resource['metadata'] ?? {};
    final String subject = metadata['subject'] ?? 'General';
    final String topic = metadata['topic'] ?? '';

    // Get file info with fallbacks
    final Map<String, dynamic> fileInfo = resource['file'] ?? {};
    final String fileType = fileInfo['type'] ?? 'document';
    final String thumbnailUrl = fileInfo['thumbnailUrl'] ?? '';
    final int fileSize = fileInfo['size'] ?? 0;
    final int? duration = fileInfo['duration'];

    // Get stats with fallbacks
    final int views = resource['views'] ?? 0;
    final int downloads = resource['downloads'] ?? 0;
    final double rating = (resource['averageRating'] ?? 0).toDouble();

    // Get uploader info
    final Map<String, dynamic> uploader = resource['uploadedBy'] ?? {};
    final String uploaderName = uploader['name'] ?? 'Unknown';

    // Get tags
    final List<dynamic> tags = resource['tags'] ?? [];

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail with overlay badges
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                child: thumbnailUrl.isNotEmpty
                    ? Image.network(
                        thumbnailUrl,
                        height: 160,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            height: 160,
                            color: Colors.grey[300],
                            child: Icon(
                              _getFileTypeIcon(fileType),
                              size: 64,
                              color: Colors.white,
                            ),
                          );
                        },
                      )
                    : Container(
                        height: 160,
                        color: Colors.grey[300],
                        child: Icon(
                          _getFileTypeIcon(fileType),
                          size: 64,
                          color: Colors.white,
                        ),
                      ),
              ),

              // Featured badge
              if (isFeatured)
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.amber,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.star, color: Colors.white, size: 12),
                        SizedBox(width: 4),
                        Text(
                          "Featured",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // File type badge
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getTypeBadgeColor(fileType),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(_getFileTypeIcon(fileType),
                          color: Colors.white, size: 12),
                      SizedBox(width: 4),
                      Text(
                        fileType.toUpperCase(),
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Content
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 8),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),

                // Metadata
                SizedBox(height: 16),
                Row(
                  children: [
                    Icon(Icons.person, size: 16, color: studentPrimaryColor),
                    SizedBox(width: 4),
                    Text(
                      uploaderName,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[700],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.book, size: 16, color: studentPrimaryColor),
                    SizedBox(width: 4),
                    Text(
                      "$subject${topic.isNotEmpty ? ' • $topic' : ''}",
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[700],
                      ),
                    ),
                  ],
                ),
                if (duration != null) ...[
                  SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.access_time,
                          size: 16, color: studentPrimaryColor),
                      SizedBox(width: 4),
                      Text(
                        "Duration: ${_formatDuration(duration)}",
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ],

                // Tags
                if (tags.isNotEmpty) ...[
                  SizedBox(height: 16),
                  Container(
                    height: 24,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: tags.length > 3 ? 4 : tags.length,
                      itemBuilder: (context, index) {
                        if (index < 3) {
                          return Container(
                            margin: EdgeInsets.only(right: 8),
                            padding: EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.tag,
                                    size: 12, color: Colors.grey[600]),
                                SizedBox(width: 4),
                                Text(
                                  tags[index].toString(),
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: Colors.grey[700],
                                  ),
                                ),
                              ],
                            ),
                          );
                        } else {
                          return Container(
                            margin: EdgeInsets.only(right: 8),
                            padding: EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              "+${tags.length - 3}",
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey[700],
                              ),
                            ),
                          );
                        }
                      },
                    ),
                  ),
                ],

                // Divider
                SizedBox(height: 16),
                Divider(color: Colors.grey[300]),

                // Bottom stats and action
                SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Rating
                    Row(
                      children: List.generate(5, (index) {
                        return Icon(
                          index < rating.floor()
                              ? Icons.star
                              : Icons.star_border,
                          color: Colors.amber,
                          size: 16,
                        );
                      }),
                    ),

                    // Stats
                    Row(
                      children: [
                        Icon(Icons.visibility,
                            size: 14, color: Colors.grey[600]),
                        SizedBox(width: 4),
                        Text(
                          "$views",
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.download, size: 14, color: Colors.grey[600]),
                        SizedBox(width: 4),
                        Text(
                          "$downloads",
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                // File size and download button
                SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _formatFileSize(fileSize),
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[500],
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: () {
                        // Download logic would go here
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("Downloading ${title}..."),
                            duration: Duration(seconds: 2),
                          ),
                        );
                      },
                      icon: Icon(Icons.download, size: 16),
                      label: Text("Download"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: studentPrimaryColor,
                        foregroundColor: Colors.white,
                        padding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                        minimumSize: Size(0, 36),
                        textStyle: TextStyle(fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNewsCard(dynamic news) {
    // Extract necessary data with proper null checks
    final String title =
        news['newsHeading'] ?? news['title'] ?? 'Untitled News';
    final String content =
        news['content'] ?? news['excerpt'] ?? 'No content available';
    final bool isFeatured = news['isFeatured'] ?? false;
    final String category = news['category'] ?? 'General';
    final String imageUrl = news['imageUrl'] ?? '';

    // Get author info
    final Map<String, dynamic> author = news['author'] ?? {};
    final String authorName = author['name'] ?? 'Unknown';
    final String authorImage = author['profilePic'] ?? '';

    // Get stats
    final int views = news['views'] ?? 0;
    final int likes = news['likes'] ?? 0;
    final int comments = news['commentsCount'] ?? 0;

    // Get tags and published date
    final List<dynamic> tags = news['tags'] ?? [];
    final String publishedAt = news['publishedAt'] ?? '';

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image with overlay badges
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                child: imageUrl.isNotEmpty
                    ? Image.network(
                        imageUrl,
                        height: 180,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            height: 180,
                            color: Colors.grey[300],
                            child: Icon(
                              Icons.article,
                              size: 64,
                              color: Colors.white,
                            ),
                          );
                        },
                      )
                    : Container(
                        height: 180,
                        color: Colors.grey[300],
                        child: Icon(
                          Icons.article,
                          size: 64,
                          color: Colors.white,
                        ),
                      ),
              ),

              // Featured badge
              if (isFeatured)
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.amber,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.star, color: Colors.white, size: 12),
                        SizedBox(width: 4),
                        Text(
                          "Featured",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // Category badge
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getCategoryBadgeColor(category),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(_getCategoryIcon(category),
                          color: Colors.white, size: 12),
                      SizedBox(width: 4),
                      Text(
                        category.toUpperCase(),
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Content
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 8),
                Text(
                  content,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),

                // Author and date
                SizedBox(height: 16),
                Row(
                  children: [
                    CircleAvatar(
                      radius: 16,
                      backgroundImage: authorImage.isNotEmpty
                          ? NetworkImage(authorImage)
                          : null,
                      backgroundColor: Colors.grey[300],
                      child: authorImage.isEmpty
                          ? Text(
                              authorName.isNotEmpty
                                  ? authorName[0].toUpperCase()
                                  : '?',
                              style: TextStyle(color: Colors.white),
                            )
                          : null,
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            authorName,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                          if (publishedAt.isNotEmpty)
                            Text(
                              _formatDate(publishedAt),
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),

                // Tags
                if (tags.isNotEmpty) ...[
                  SizedBox(height: 16),
                  Container(
                    height: 24,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: tags.length > 3 ? 4 : tags.length,
                      itemBuilder: (context, index) {
                        if (index < 3) {
                          return Container(
                            margin: EdgeInsets.only(right: 8),
                            padding: EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.tag,
                                    size: 12, color: Colors.grey[600]),
                                SizedBox(width: 4),
                                Text(
                                  tags[index].toString(),
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: Colors.grey[700],
                                  ),
                                ),
                              ],
                            ),
                          );
                        } else {
                          return Container(
                            margin: EdgeInsets.only(right: 8),
                            padding: EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              "+${tags.length - 3}",
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey[700],
                              ),
                            ),
                          );
                        }
                      },
                    ),
                  ),
                ],

                // Divider
                SizedBox(height: 16),
                Divider(color: Colors.grey[300]),

                // Engagement stats and action
                SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Stats
                    Row(
                      children: [
                        Icon(Icons.visibility,
                            size: 14, color: Colors.grey[600]),
                        SizedBox(width: 4),
                        Text(
                          "$views",
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.thumb_up, size: 14, color: Colors.grey[600]),
                        SizedBox(width: 4),
                        Text(
                          "$likes",
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.comment, size: 14, color: Colors.grey[600]),
                        SizedBox(width: 4),
                        Text(
                          "$comments",
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),

                    // Read more button
                    ElevatedButton(
                      onPressed: () {
                        // Read more logic would go here
                        Navigator.pushNamed(
                          context,
                          '/newsdetail',
                          arguments: news,
                        );
                      },
                      child: Text("Read More"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: studentPrimaryColor,
                        foregroundColor: Colors.white,
                        padding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                        minimumSize: Size(0, 36),
                        textStyle: TextStyle(fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Get category icon
  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'announcement':
        return Icons.campaign;
      case 'event':
        return Icons.event;
      case 'achievement':
        return Icons.emoji_events;
      case 'academic':
        return Icons.school;
      default:
        return Icons.article;
    }
  }
}
