import 'package:equatable/equatable.dart';

class YearlyEvent extends Equatable {
  final String id;
  final String personId;
  final int year;
  final DateTime? partyDate;
  final String? partyTime;
  final String? partyLocation;
  final bool giftBought;
  final String? giftDescription;
  final bool rsvpSent;
  final bool cardSent;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  const YearlyEvent({
    required this.id,
    required this.personId,
    required this.year,
    this.partyDate,
    this.partyTime,
    this.partyLocation,
    this.giftBought = false,
    this.giftDescription,
    this.rsvpSent = false,
    this.cardSent = false,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  YearlyEvent copyWith({
    String? id,
    String? personId,
    int? year,
    DateTime? partyDate,
    String? partyTime,
    String? partyLocation,
    bool? giftBought,
    String? giftDescription,
    bool? rsvpSent,
    bool? cardSent,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return YearlyEvent(
      id: id ?? this.id,
      personId: personId ?? this.personId,
      year: year ?? this.year,
      partyDate: partyDate ?? this.partyDate,
      partyTime: partyTime ?? this.partyTime,
      partyLocation: partyLocation ?? this.partyLocation,
      giftBought: giftBought ?? this.giftBought,
      giftDescription: giftDescription ?? this.giftDescription,
      rsvpSent: rsvpSent ?? this.rsvpSent,
      cardSent: cardSent ?? this.cardSent,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        personId,
        year,
        partyDate,
        partyTime,
        partyLocation,
        giftBought,
        giftDescription,
        rsvpSent,
        cardSent,
        notes,
        createdAt,
        updatedAt,
      ];
}
