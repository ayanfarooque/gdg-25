import 'package:flutter/material.dart';
import 'dart:convert';
import '../../components/header.dart';
import '../../components/footer.dart';
import '../../components/news_card.dart';
import 'package:http/http.dart' as http;

class ResourceLanding extends StatefulWidget {
  @override
  State<ResourceLanding> createState() => _LandingPageState();
}

class _LandingPageState extends State<ResourceLanding> {
  int _selectedIndex = 0;
  List<dynamic> _news = [];
  List<dynamic> _filteredNews = [];
  TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";

  @override
  void initState() {
    super.initState();
    _loadNews();
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
        });
      } else {
        throw Exception('Failed to load news');
      }
    } catch (e) {
      print('Error fetching news: $e');
    }
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text;
      _filteredNews = _news
          .where((news) => news['newsHeading']
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()))
          .toList();
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    // Navigate to different pages based on index
    switch (index) {
      case 0:
        Navigator.pushNamed(context, '/');
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
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 73, 171, 176),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Header(
                  onProfileTap: () {
                    Navigator.pushNamed(context, '/profile');
                  },
                  onNotificationTap: () {
                    Navigator.pushNamed(context, '/notifications');
                  },
                  profileImage: 'assets/images/image3.png',
                  welcomeText: "WELCOME HASHIM",
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
                          ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF49ABB0),
                              elevation: 2,
                              shadowColor: Colors.black,
                            ),
                            child: const Text(
                              "Recommended",
                              style: TextStyle(color: Colors.black),
                            ),
                          ),
                          const SizedBox(width: 8.9),
                          ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF49ABB0),
                              elevation: 2,
                              shadowColor: Colors.black,
                            ),
                            child: const Text(
                              "Resources",
                              style: TextStyle(color: Colors.black),
                            ),
                          ),
                          const SizedBox(width: 8.8),
                          ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF49ABB0),
                              elevation: 2,
                              shadowColor: Colors.black,
                            ),
                            child: const Text(
                              "News",
                              style: TextStyle(color: Colors.black),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    ..._filteredNews
                        .map((news) => NewsCard(news: news))
                        .toList(),
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
