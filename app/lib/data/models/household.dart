import 'package:equatable/equatable.dart';

enum MemberRole { adult, child }

class Household extends Equatable {
  final String id;
  final String? name;
  final String inviteCode;
  final List<HouseholdMember> members;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Household({
    required this.id,
    this.name,
    required this.inviteCode,
    required this.members,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [id, name, inviteCode, members, createdAt, updatedAt];
}

class HouseholdMember extends Equatable {
  final String id;
  final String householdId;
  final String? userId;
  final String name;
  final MemberRole role;
  final bool isOwner;
  final DateTime createdAt;

  const HouseholdMember({
    required this.id,
    required this.householdId,
    this.userId,
    required this.name,
    required this.role,
    required this.isOwner,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, householdId, userId, name, role, isOwner, createdAt];
}
