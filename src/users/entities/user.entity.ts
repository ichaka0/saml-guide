import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserRole } from '../enum/user-role.enum';
import { BaseEntity } from 'src/common/base.entity';

@Entity('users')
export class User extends BaseEntity {

  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, select: false })
  password?: string | null;

  @Column({ name: 'password_changed_at', type: 'timestamptz', nullable: true })
  passwordChangedAt: Date | null;
}

