import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle; // Added missing import
import '../../components/teacherheader.dart';
import '../../components/footer.dart';
import '../../components/news_card.dart';
import '../../components/resourceCard.dart';

class FacResourceLanding extends StatefulWidget {
  @override
  State<FacResourceLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<FacResourceLanding> {
  int _selectedIndex = 0;
  List<dynamic> _news = [];
  List<dynamic> _resources = []; // Added resources list
  List<dynamic> _filteredItems = []; // Added filteredItems list
  TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";
  bool _showRecommended = true;
  bool _showResources = false; // Added missing variable
  bool _showNews = false; // Added missing variable

  @override
  void initState() {
    super.initState();
    _loadData();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  // Modified to load both news and resources
  void _loadData() async {
    try {
      final String newsResponse =
          await rootBundle.loadString('lib/data/news.json');
      final newsData = json.decode(newsResponse);

      // Try to load resources data too
      try {
        final String resourcesResponse =
            await rootBundle.loadString('lib/data/resources.json');
        final resourcesData = json.decode(resourcesResponse);

        setState(() {
          _news = newsData;
          _resources = resourcesData;
          _showRecommended = true;
          _showResources = false;
          _showNews = false;
          _updateFilteredItems();
        });
      } catch (e) {
        print("Error loading resources: $e");
        setState(() {
          _news = newsData;
          _resources = [];
          _filteredItems = _news;
        });
      }
    } catch (e) {
      print("Error loading news: $e");
      setState(() {
        _news = [];
        _resources = [];
        _filteredItems = [];
      });
    }
  }

  // Update filtered items based on current selection and search query
  void _updateFilteredItems() {
    if (_showRecommended) {
      _filteredItems = [..._news, ..._resources]
          .where((item) => item['stared'] == true)
          .toList();
    } else if (_showResources) {
      _filteredItems = _resources;
    } else if (_showNews) {
      _filteredItems = _news;
    } else {
      _filteredItems = [..._news, ..._resources];
    }

    // Apply search filter if there's a query
    if (_searchQuery.isNotEmpty) {
      _filteredItems = _filteredItems.where((item) {
        String title = item.containsKey('newsHeading')
            ? item['newsHeading']
            : (item.containsKey('resourceTitle') ? item['resourceTitle'] : '');

        return title.toLowerCase().contains(_searchQuery.toLowerCase());
      }).toList();
    }
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
        Navigator.pushNamed(context, '/teacherhome');
        break;
      case 1:
        Navigator.pushNamed(context, '/teacherassignment');
        break;
      case 2:
        Navigator.pushNamed(context, '/teachercommunity');
        break;
      case 3:
        Navigator.pushNamed(context, '/teacherai');
        break;
      case 4:
        Navigator.pushNamed(context, '/teacherresources');
        break;
    }
  }

  void _showRecommendedCards() {
    setState(() {
      _showRecommended = true;
      _showResources = false;
      _showNews = false;
      _updateFilteredItems();
    });
  }

  void _showAllResources() {
    setState(() {
      _showRecommended = false;
      _showResources = true;
      _showNews = false;
      _updateFilteredItems();
    });
  }

  void _showAllNews() {
    // Added missing method
    setState(() {
      _showRecommended = false;
      _showResources = false;
      _showNews = true;
      _updateFilteredItems();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE195AB),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: TeacherHeader(
                  onProfileTap: () {
                    Navigator.pushNamed(context, '/teacherprofile');
                  },
                  onNotificationTap: () {
                    Navigator.pushNamed(context, '/teachernotifications');
                  },
                  profileImage: 'assets/images/teacher.png',
                  welcomeText: "WELCOME",
                ),
              ),
              const SizedBox(height: 10),
              Container(
                width: double.infinity, // Changed from fixed width
                margin: const EdgeInsets.fromLTRB(0.0, 30.0, 0.0, 0.0),
                padding: const EdgeInsets.fromLTRB(0.0, 12.0, 0.0, 12.0),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 236, 231, 202),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Column(
                  children: [
                    // Fixed the Drawer which was empty
                    Container(
                      height: 1,
                      color: Colors.black12,
                    ),
                    Container(
                      margin: EdgeInsets.fromLTRB(30.0, 10.0, 0.0, 0.0),
                      child: Row(
                        children: [
                          Container(
                            padding: EdgeInsets.all(0.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "RESOURCES",
                                  style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold),
                                ),
                                Text(
                                  "Recommended for you",
                                  style: TextStyle(fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 30),
                          Expanded(
                            child: Container(
                              height: 33,
                              padding: EdgeInsets.fromLTRB(12.0, 2.0, 4.0, 2.0),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: TextField(
                                      controller: _searchController,
                                      decoration: InputDecoration(
                                        hintText: "Search",
                                        border: InputBorder.none,
                                      ),
                                    ),
                                  ),
                                  Icon(Icons.search, size: 25),
                                ],
                              ),
                            ),
                          ),
                          SizedBox(width: 10),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: EdgeInsets.all(12.0),
                      decoration: BoxDecoration(
                        color: const Color.fromARGB(255, 236, 231, 202),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _showRecommended
                              ? ElevatedButton(
                                  onPressed: _showRecommendedCards,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFFE195AB),
                                    elevation: 2,
                                    shadowColor: Colors.black,
                                  ),
                                  child: const Text(
                                    "Recommended",
                                    style: TextStyle(color: Colors.black),
                                  ),
                                )
                              : OutlinedButton(
                                  onPressed: _showRecommendedCards,
                                  style: OutlinedButton.styleFrom(
                                    side: BorderSide(
                                        color: const Color(0xFFE195AB)),
                                  ),
                                  child: const Text(
                                    "Recommended",
                                    style: TextStyle(
                                        color: const Color(0xFFE195AB)),
                                  ),
                                ),
                          const SizedBox(height: 10),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _showResources
                                  ? ElevatedButton(
                                      onPressed: _showAllResources,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor:
                                            const Color(0xFFE195AB),
                                        elevation: 2,
                                        shadowColor: Colors.black,
                                      ),
                                      child: const Text(
                                        "Resources",
                                        style: TextStyle(color: Colors.black),
                                      ),
                                    )
                                  : OutlinedButton(
                                      onPressed: _showAllResources,
                                      style: OutlinedButton.styleFrom(
                                        side: BorderSide(
                                            color: const Color(0xFFE195AB)),
                                      ),
                                      child: const Text(
                                        "Resources",
                                        style: TextStyle(
                                            color: const Color(0xFFE195AB)),
                                      ),
                                    ),
                              const SizedBox(width: 8.8),
                              _showNews
                                  ? ElevatedButton(
                                      onPressed: _showAllNews,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor:
                                            const Color(0xFFE195AB),
                                        elevation: 2,
                                        shadowColor: Colors.black,
                                      ),
                                      child: const Text(
                                        "News",
                                        style: TextStyle(color: Colors.black),
                                      ),
                                    )
                                  : OutlinedButton(
                                      onPressed: _showAllNews,
                                      style: OutlinedButton.styleFrom(
                                        side: BorderSide(
                                            color: const Color(0xFFE195AB)),
                                      ),
                                      child: const Text(
                                        "News",
                                        style: TextStyle(
                                            color: const Color(0xFFE195AB)),
                                      ),
                                    ),
                            ],
                          )
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    if (_filteredItems.isEmpty)
                      Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Center(
                          child: Text(
                            "No items found",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      )
                    else
                      ...(_filteredItems.map((item) {
                        if (item.containsKey('newsId')) {
                          return NewsCard(news: item);
                        } else if (item.containsKey('resourcesId')) {
                          return ResourceCard(resource: item);
                        }
                        return Container();
                      }).toList()),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Footer(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}
