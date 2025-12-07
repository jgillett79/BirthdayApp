import 'package:dio/dio.dart';
import '../../core/config/api_config.dart';

class ApiClient {
  final Dio _dio;
  final String baseUrl;

  /// Create API client with custom base URL
  ApiClient({
    required this.baseUrl,
    String? authToken,
  }) : _dio = Dio(
          BaseOptions(
            baseUrl: baseUrl,
            connectTimeout: const Duration(seconds: 30),
            receiveTimeout: const Duration(seconds: 30),
            headers: {
              'Content-Type': 'application/json',
              if (authToken != null) 'Authorization': 'Bearer $authToken',
            },
          ),
        ) {
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));
  }

  /// Create API client using the configured backend URL from ApiConfig
  ///
  /// This factory constructor automatically uses the correct URL based on environment:
  /// - Production builds use the Railway URL
  /// - Debug builds use localhost
  factory ApiClient.fromConfig({String? authToken}) {
    return ApiClient(
      baseUrl: ApiConfig.apiUrl,
      authToken: authToken,
    );
  }

  // Auth endpoints
  Future<Map<String, dynamic>> register({
    required String firebaseUid,
    required String name,
    String? email,
  }) async {
    final response = await _dio.post('/api/auth/register', data: {
      'firebaseUid': firebaseUid,
      'name': name,
      'email': email,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getMe() async {
    final response = await _dio.get('/api/auth/me');
    return response.data;
  }

  // Household endpoints
  Future<Map<String, dynamic>> createHousehold({String? name}) async {
    final response = await _dio.post('/api/household', data: {'name': name});
    return response.data;
  }

  Future<Map<String, dynamic>> getHousehold() async {
    final response = await _dio.get('/api/household');
    return response.data;
  }

  Future<Map<String, dynamic>> joinHousehold(String inviteCode) async {
    final response = await _dio.post('/api/household/join', data: {
      'inviteCode': inviteCode,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> addHouseholdMember({
    required String name,
    required String role,
    String? userId,
  }) async {
    final response = await _dio.post('/api/household/members', data: {
      'name': name,
      'role': role,
      'userId': userId,
    });
    return response.data;
  }

  // People endpoints
  Future<List<dynamic>> getPeople({
    String? anchorMemberId,
    String? relationshipType,
    String? search,
  }) async {
    final response = await _dio.get('/api/people', queryParameters: {
      if (anchorMemberId != null) 'anchorMemberId': anchorMemberId,
      if (relationshipType != null) 'relationshipType': relationshipType,
      if (search != null) 'search': search,
    });
    return response.data;
  }

  Future<List<dynamic>> getUpcomingBirthdays({int days = 30}) async {
    final response = await _dio.get('/api/people/upcoming', queryParameters: {
      'days': days,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> createPerson(Map<String, dynamic> data) async {
    final response = await _dio.post('/api/people', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> getPerson(String id) async {
    final response = await _dio.get('/api/people/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> updatePerson(
    String id,
    Map<String, dynamic> data,
  ) async {
    final response = await _dio.put('/api/people/$id', data: data);
    return response.data;
  }

  Future<void> deletePerson(String id) async {
    await _dio.delete('/api/people/$id');
  }

  // Yearly Events endpoints
  Future<List<dynamic>> getYearlyEventsForPerson(String personId) async {
    final response = await _dio.get('/api/yearly-events/person/$personId');
    return response.data;
  }

  Future<Map<String, dynamic>> getYearlyEvent(String personId, int year) async {
    final response = await _dio.get('/api/yearly-events/person/$personId/year/$year');
    return response.data;
  }

  Future<Map<String, dynamic>> updateYearlyEvent(
    String personId,
    int year,
    Map<String, dynamic> data,
  ) async {
    final response = await _dio.put(
      '/api/yearly-events/person/$personId/year/$year',
      data: data,
    );
    return response.data;
  }

  // Sync endpoints
  Future<Map<String, dynamic>> pushSync(List<Map<String, dynamic>> changes) async {
    final response = await _dio.post('/api/sync/push', data: {
      'changes': changes,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> pullSync(int sinceTimestamp) async {
    final response = await _dio.get('/api/sync/pull', queryParameters: {
      'since': sinceTimestamp,
    });
    return response.data;
  }

  void updateAuthToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  void clearAuthToken() {
    _dio.options.headers.remove('Authorization');
  }
}
