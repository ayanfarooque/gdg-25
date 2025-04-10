import 'package:flutter/material.dart';
import 'dart:convert';
import '../../components/teacherheader.dart';
import '../../components/footer.dart';
import '../../components/news_card.dart';
import '../../components/resourceCard.dart';
import 'package:http/http.dart' as http;

class FacResourceLanding extends StatefulWidget {
  @override
  State<FacResourceLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<FacResourceLanding> {
  int _selectedIndex = 0;
  List<dynamic> _news = [];
  List<dynamic> _resources = [];
  List<dynamic> _filteredItems = [];
  TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";
  bool _showRecommended = true;
  bool _showResources = false;
  bool _showNews = false;

  @override
  void initState() {
    super.initState();
    _loadNews();
    _loadResources();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _loadNews() async {
    try {
      final response =
          await http.get(Uri.parse('http://192.168.0.104:5000/api/news/news'));
      if (response.statusCode == 200) {
        setState(() {
          _news = json.decode(response.body);
          _updateFilteredItems();
        });
      } else {
        throw Exception('Failed to load news');
      }
    } catch (e) {
      print('Error fetching news: $e');
    }
  }

  void _loadResources() async {
    try {
      final response = await http
          .get(Uri.parse('http://192.168.0.104:5000/api/resources/resources'));
      if (response.statusCode == 200) {
        setState(() {
          _resources = json.decode(response.body);
          _updateFilteredItems();
        });
      } else {
        throw Exception('Failed to load resources');
      }
    } catch (e) {
      print('Error fetching resources: $e');
    }
  }

  void _updateFilteredItems() {
    if (_showRecommended) {
      _filteredItems = [
        ..._news.where((news) => news['stared'] == true),
        ..._resources.where((resource) => resource['stared'] == true)
      ];
    } else if (_showResources) {
      _filteredItems = _resources;
    } else if (_showNews) {
      _filteredItems = _news;
    }
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text;
      if (_showResources) {
        _filteredItems = _resources
            .where((resource) => resource['resourcesHeading']
                .toLowerCase()
                .contains(_searchQuery.toLowerCase()))
            .toList();
      } else if (_showNews) {
        _filteredItems = _news
            .where((news) => news['newsHeading']
                .toLowerCase()
                .contains(_searchQuery.toLowerCase()))
            .toList();
      } else {
        _filteredItems = [
          ..._news.where((news) => news['newsHeading']
              .toLowerCase()
              .contains(_searchQuery.toLowerCase())),
          ..._resources.where((resource) => resource['resourcesHeading']
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()))
        ];
      }
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    // Navigate to different pages based on index
    switch (index) {
      case 0:
        Navigator.pushNamed(context, '/taecherhome');
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
                  welcomeText: "WELCOME SENSEI",
                ),
              ),
              const SizedBox(height: 10),
              Container(
                width: 400,
                margin: const EdgeInsets.fromLTRB(0.0, 30.0, 0.0, 0.0),
                padding: const EdgeInsets.fromLTRB(0.0, 12.0, 0.0, 12.0),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 236, 231, 202),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Column(
                  children: [
                    Drawer(
                      
                    ),
                    Container(
                      margin: EdgeInsets.fromLTRB(30.0, 10.0, 0.0, 0.0),
                      decoration: BoxDecoration(),
                      child: Row(
                        children: [
                          Container(
                            padding: EdgeInsets.all(0.0),
                            child: Column(
                              children: [
                                Text(
                                  "RESOURCES",
                                  style: TextStyle(fontSize: 20),
                                ),
                                Text(
                                  "Recommended for you",
                                  style: TextStyle(fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 30),
                          Container(
                            width: 180,
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
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: EdgeInsets.all(12.0),
                      decoration: BoxDecoration(
                        color: const Color.fromARGB(255, 236, 231, 202),
                      ),
                      child: Row(
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
                          const SizedBox(width: 8.9),
                          _showResources
                              ? ElevatedButton(
                                  onPressed: _showAllResources,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFFE195AB),
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
                                    backgroundColor: const Color(0xFFE195AB),
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
                      ),
                    ),
                    const SizedBox(height: 10),
                    ..._filteredItems.map((item) {
                      if (item.containsKey('newsId')) {
                        return NewsCard(news: item);
                      } else if (item.containsKey('resourcesId')) {
                        return ResourceCard(resource: item);
                      }
                      return Container();
                    }).toList(),
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
