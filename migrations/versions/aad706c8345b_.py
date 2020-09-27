"""empty message

Revision ID: aad706c8345b
Revises: 576fd6c538af
Create Date: 2020-09-27 01:11:30.237406

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'aad706c8345b'
down_revision = '576fd6c538af'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('sessions', sa.Column('end_level', sa.Integer(), nullable=True))
    op.add_column('sessions', sa.Column('start_level', sa.Integer(), nullable=True))
    op.add_column('sessions', sa.Column('time_created', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))
    op.add_column('sessions', sa.Column('time_updated', sa.DateTime(timezone=True), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('sessions', 'time_updated')
    op.drop_column('sessions', 'time_created')
    op.drop_column('sessions', 'start_level')
    op.drop_column('sessions', 'end_level')
    # ### end Alembic commands ###
