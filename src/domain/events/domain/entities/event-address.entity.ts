import { EventEntity } from '@domain/events/domain/entities/event.entity'
import { DomainEntity } from '@domain/shared/domain.entity'
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm'
@Entity('event_address')
export class EventAddressEntity extends DomainEntity {
  private _street: string
  private _city: string
  private _zipCode: string
  private _country: string
  private _eventId: string
  private _isChanged: boolean = false

  private updateField<Value>(field: string, value: Value) {
    if (this[field] !== value) {
      this[field] = value
      this._isChanged = true
    }
  }

  @Column()
  get street(): string {
    return this._street
  }

  set street(value: string) {
    this.updateField('_street', value)
  }

  @Column()
  get city(): string {
    return this._city
  }

  set city(value: string) {
    this.updateField('_city', value)
  }

  @Column()
  get zipCode(): string {
    return this._zipCode
  }

  set zipCode(value: string) {
    this.updateField('_zipCode', value)
  }

  @Column()
  get country(): string {
    return this._country
  }

  set country(value: string) {
    this.updateField('_country', value)
  }

  @Column()
  get eventId(): string {
    return this._eventId
  }

  set eventId(value: string) {
    this.updateField('_eventId', value)
  }

  @JoinColumn()
  @OneToOne(() => EventEntity)
  event: Relation<EventEntity>

  get isChanged(): boolean {
    return this._isChanged
  }
}
